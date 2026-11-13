/**
 * Student Management System - Students List Component
 * Comprehensive data table with search, filtering, sorting, pagination, and CRUD triggers.
 */

const StudentsComponent = {
  state: {
    searchTerm: '',
    departmentFilter: 'all',
    genderFilter: 'all',
    statusFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc', // 'asc' or 'desc'
    currentPage: 1,
    pageSize: 8
  },

  init() {
    this.bindEvents();
    this.populateFilterDropdowns();
  },

  bindEvents() {
    const searchInput = document.getElementById('student-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchTerm = e.target.value.toLowerCase().trim();
        this.state.currentPage = 1;
        this.render();
      });
    }

    const deptFilter = document.getElementById('filter-department');
    if (deptFilter) {
      deptFilter.addEventListener('change', (e) => {
        this.state.departmentFilter = e.target.value;
        this.state.currentPage = 1;
        this.render();
      });
    }

    const genderFilter = document.getElementById('filter-gender');
    if (genderFilter) {
      genderFilter.addEventListener('change', (e) => {
        this.state.genderFilter = e.target.value;
        this.state.currentPage = 1;
        this.render();
      });
    }

    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.state.statusFilter = e.target.value;
        this.state.currentPage = 1;
        this.render();
      });
    }

    const sortSelect = document.getElementById('sort-students');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const [field, order] = e.target.value.split('_');
        this.state.sortBy = field;
        this.state.sortOrder = order || 'asc';
        this.render();
      });
    }

    const pageSizeSelect = document.getElementById('table-page-size');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        this.state.pageSize = parseInt(e.target.value, 10);
        this.state.currentPage = 1;
        this.render();
      });
    }

    // Export Students Button
    const exportBtn = document.getElementById('btn-export-students-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToCSV());
    }
  },

  populateFilterDropdowns() {
    const deptSelect = document.getElementById('filter-department');
    if (deptSelect) {
      const depts = storage.getDepartments();
      const current = deptSelect.value;
      deptSelect.innerHTML = '<option value="all">All Departments</option>' +
        depts.map(d => `<option value="${UI.escapeHTML(d.name)}">${UI.escapeHTML(d.name)}</option>`).join('');
      deptSelect.value = current || 'all';
    }
  },

  getFilteredAndSortedStudents() {
    let list = storage.getStudents();

    // 1. Search filter
    if (this.state.searchTerm) {
      const term = this.state.searchTerm;
      list = list.filter(s => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        const id = (s.id || '').toLowerCase();
        const email = (s.email || '').toLowerCase();
        const phone = (s.phone || '').toLowerCase();
        const dept = (s.department || '').toLowerCase();
        return fullName.includes(term) || id.includes(term) || email.includes(term) || phone.includes(term) || dept.includes(term);
      });
    }

    // 2. Department filter
    if (this.state.departmentFilter !== 'all') {
      list = list.filter(s => s.department === this.state.departmentFilter);
    }

    // 3. Gender filter
    if (this.state.genderFilter !== 'all') {
      list = list.filter(s => s.gender && s.gender.toLowerCase() === this.state.genderFilter.toLowerCase());
    }

    // 4. Status filter
    if (this.state.statusFilter !== 'all') {
      list = list.filter(s => s.status && s.status.toLowerCase() === this.state.statusFilter.toLowerCase());
    }

    // 5. Sorting
    list.sort((a, b) => {
      let comparison = 0;
      if (this.state.sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (this.state.sortBy === 'id') {
        comparison = (a.id || '').localeCompare(b.id || '');
      } else if (this.state.sortBy === 'attendance') {
        comparison = (a.attendance || 0) - (b.attendance || 0);
      } else if (this.state.sortBy === 'marks') {
        const avgA = StorageService.calculateStudentAverage(a);
        const avgB = StorageService.calculateStudentAverage(b);
        comparison = avgA - avgB;
      } else if (this.state.sortBy === 'age') {
        comparison = (a.age || 0) - (b.age || 0);
      }

      return this.state.sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  },

  render() {
    this.populateFilterDropdowns();
    const students = this.getFilteredAndSortedStudents();
    const totalCount = students.length;

    // Calculate Pagination
    const totalPages = Math.ceil(totalCount / this.state.pageSize) || 1;
    if (this.state.currentPage > totalPages) {
      this.state.currentPage = totalPages;
    }
    const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
    const paginatedStudents = students.slice(startIndex, startIndex + this.state.pageSize);

    // Update Counter text
    const counterEl = document.getElementById('students-count-summary');
    if (counterEl) {
      const from = totalCount > 0 ? startIndex + 1 : 0;
      const to = Math.min(startIndex + this.state.pageSize, totalCount);
      counterEl.textContent = `Showing ${from}-${to} of ${totalCount} students`;
    }

    // Render Table Body
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    if (paginatedStudents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-5">
            <div class="empty-state">
              <div class="empty-icon">${UI.icons.users}</div>
              <h4>No Students Found</h4>
              <p class="text-muted">Try adjusting your search or filter parameters, or add a new student.</p>
              <button class="btn btn-primary mt-3" onclick="App.navigate('add-student')">
                ${UI.icons.plus} Add New Student
              </button>
            </div>
          </td>
        </tr>
      `;
      this.renderPagination(1, 1);
      return;
    }

    tbody.innerHTML = paginatedStudents.map(student => {
      const avg = StorageService.calculateStudentAverage(student);
      const grade = StorageService.calculateGrade(avg);
      const statusClass = student.status === 'Active' ? 'badge-success' : 'badge-neutral';

      return `
        <tr data-id="${student.id}">
          <td class="font-mono fw-600 text-primary">${UI.escapeHTML(student.id)}</td>
          <td>
            <div class="user-avatar-cell">
              <img src="${UI.escapeHTML(student.avatar)}" alt="${UI.escapeHTML(student.firstName)}" class="avatar-sm" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}'" />
              <div>
                <div class="fw-600">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</div>
                <div class="text-xs text-muted">${UI.escapeHTML(student.email || '')}</div>
              </div>
            </div>
          </td>
          <td>${UI.escapeHTML(student.gender || 'N/A')}</td>
          <td>${student.age || 'N/A'}</td>
          <td><span class="badge badge-dept">${UI.escapeHTML(student.department || 'Unassigned')}</span></td>
          <td class="text-sm font-mono">${UI.escapeHTML(student.phone || 'N/A')}</td>
          <td>
            <div class="d-flex align-center gap-2">
              <span class="badge badge-att ${student.attendance >= 85 ? 'att-good' : student.attendance >= 70 ? 'att-warn' : 'att-danger'}">
                ${student.attendance || 0}%
              </span>
            </div>
          </td>
          <td>
            <span class="badge badge-${grade.color}">
              ${avg}% (${grade.letter})
            </span>
          </td>
          <td>
            <span class="badge ${statusClass}">
              ${UI.escapeHTML(student.status || 'Active')}
            </span>
          </td>
          <td class="text-right">
            <div class="action-btn-group">
              <button class="btn-icon" title="View Profile" onclick="StudentProfileComponent.show('${student.id}')">
                ${UI.icons.eye}
              </button>
              <button class="btn-icon text-primary" title="Edit Student" onclick="StudentFormComponent.editStudent('${student.id}')">
                ${UI.icons.edit}
              </button>
              <button class="btn-icon text-danger" title="Delete Student" onclick="StudentsComponent.promptDelete('${student.id}')">
                ${UI.icons.trash}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.renderPagination(this.state.currentPage, totalPages);
  },

  renderPagination(currentPage, totalPages) {
    const container = document.getElementById('students-pagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let buttonsHtml = `
      <button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="StudentsComponent.goToPage(${currentPage - 1})">
        &laquo; Prev
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      // Show first, last, and pages around current page
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        buttonsHtml += `
          <button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="StudentsComponent.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttonsHtml += `<span class="page-dots">...</span>`;
      }
    }

    buttonsHtml += `
      <button class="btn-page ${currentPage === totalPages ? 'disabled' : ''} onclick="StudentsComponent.goToPage(${currentPage + 1})">
        Next &raquo;
      </button>
    `;

    container.innerHTML = buttonsHtml;
  },

  goToPage(page) {
    this.state.currentPage = page;
    this.render();
  },

  promptDelete(studentId) {
    const student = storage.getStudentById(studentId);
    if (!student) return;

    UI.confirm({
      title: 'Delete Student Record',
      message: `Are you sure you want to delete <strong>${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</strong> (ID: <code>${UI.escapeHTML(student.id)}</code>)? <br/><span class="text-sm text-danger">This action will remove all their attendance and marks records permanently.</span>`,
      confirmText: 'Delete Student',
      cancelText: 'Cancel',
      isDanger: true,
      onConfirm: () => {
        storage.deleteStudent(studentId);
        UI.showToast(`Student ${student.firstName} ${student.lastName} was deleted successfully.`, 'success', 'Student Deleted');
        this.render();
        DashboardComponent.render();
      }
    });
  },

  exportToCSV() {
    const students = storage.getStudents();
    if (students.length === 0) {
      UI.showToast('No students to export.', 'warning');
      return;
    }

    const headers = ['Student ID', 'First Name', 'Last Name', 'Gender', 'Age', 'Department', 'Email', 'Phone', 'Attendance %', 'Average Marks %', 'Status'];
    const rows = students.map(s => [
      s.id,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      s.gender,
      s.age || '',
      `"${s.department}"`,
      s.email,
      `"${s.phone}"`,
      s.attendance || 0,
      StorageService.calculateStudentAverage(s),
      s.status || 'Active'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    UI.showToast('Students list exported as CSV.', 'info', 'Export Successful');
  }
};
