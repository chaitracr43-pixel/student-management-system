/**
 * Student Management System - Attendance Component
 * Daily attendance register by department/class with batch marking and status toggles.
 */

const AttendanceComponent = {
  selectedDept: 'all',
  selectedDate: new Date().toISOString().split('T')[0],
  searchTerm: '',
  currentRecords: {},

  init() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.bindEvents();
    this.populateDepartmentSelect();
  },

  populateDepartmentSelect() {
    const select = document.getElementById('attendance-dept-filter');
    if (select) {
      const depts = storage.getDepartments();
      select.innerHTML = '<option value="all">All Departments / Classes</option>' +
        depts.map(d => `<option value="${UI.escapeHTML(d.name)}">${UI.escapeHTML(d.name)}</option>`).join('');
    }
  },

  bindEvents() {
    const datePicker = document.getElementById('attendance-date-picker');
    if (datePicker) {
      datePicker.value = this.selectedDate;
      datePicker.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this.loadRecords();
      });
    }

    const deptSelect = document.getElementById('attendance-dept-filter');
    if (deptSelect) {
      deptSelect.addEventListener('change', (e) => {
        this.selectedDept = e.target.value;
        this.render();
      });
    }

    const searchInput = document.getElementById('attendance-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Batch Actions
    const markAllPresentBtn = document.getElementById('btn-mark-all-present');
    if (markAllPresentBtn) {
      markAllPresentBtn.addEventListener('click', () => this.batchSetStatus('present'));
    }

    const markAllAbsentBtn = document.getElementById('btn-mark-all-absent');
    if (markAllAbsentBtn) {
      markAllAbsentBtn.addEventListener('click', () => this.batchSetStatus('absent'));
    }

    const markAllLateBtn = document.getElementById('btn-mark-all-late');
    if (markAllLateBtn) {
      markAllLateBtn.addEventListener('click', () => this.batchSetStatus('late'));
    }

    // Save Attendance Button
    const saveBtn = document.getElementById('btn-save-attendance');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.save());
    }
  },

  loadRecords() {
    const saved = storage.getAttendanceForDate(this.selectedDate);
    const students = storage.getStudents();
    
    this.currentRecords = {};
    students.forEach(s => {
      // Default to saved record or 'present'
      this.currentRecords[s.id] = saved[s.id] || 'present';
    });

    this.render();
  },

  setStatus(studentId, status) {
    this.currentRecords[studentId] = status;
    this.updateStudentRow(studentId, status);
    this.updateStats();
  },

  batchSetStatus(status) {
    const students = this.getFilteredStudents();
    students.forEach(s => {
      this.currentRecords[s.id] = status;
    });
    this.render();
    UI.showToast(`Marked ${students.length} students as ${status.toUpperCase()}.`, 'info');
  },

  save() {
    storage.saveAttendance(this.selectedDate, this.currentRecords);
    UI.showToast(`Attendance for ${this.selectedDate} saved successfully!`, 'success', 'Attendance Saved');
    StudentsComponent.render();
    DashboardComponent.render();
  },

  getFilteredStudents() {
    let list = storage.getStudents();
    if (this.selectedDept !== 'all') {
      list = list.filter(s => s.department === this.selectedDept);
    }
    if (this.searchTerm) {
      const term = this.searchTerm;
      list = list.filter(s => {
        const name = `${s.firstName} ${s.lastName}`.toLowerCase();
        return name.includes(term) || (s.id || '').toLowerCase().includes(term);
      });
    }
    return list;
  },

  render() {
    this.populateDepartmentSelect();
    const students = this.getFilteredStudents();
    const tbody = document.getElementById('attendance-table-body');
    if (!tbody) return;

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-5 text-muted">
            No students found matching your criteria.
          </td>
        </tr>
      `;
      this.updateStats();
      return;
    }

    tbody.innerHTML = students.map(student => {
      const status = this.currentRecords[student.id] || 'present';
      return `
        <tr id="att-row-${student.id}">
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
          <td><span class="badge badge-dept">${UI.escapeHTML(student.department)}</span></td>
          <td>
            <span class="badge ${student.attendance >= 85 ? 'badge-success' : student.attendance >= 70 ? 'badge-warning' : 'badge-danger'}">
              ${student.attendance || 0}% overall
            </span>
          </td>
          <td>
            <div class="attendance-btn-group" role="group">
              <button 
                type="button" 
                class="att-btn att-btn-present ${status === 'present' ? 'active' : ''}" 
                onclick="AttendanceComponent.setStatus('${student.id}', 'present')">
                ${UI.icons.check} Present
              </button>
              <button 
                type="button" 
                class="att-btn att-btn-late ${status === 'late' ? 'active' : ''}" 
                onclick="AttendanceComponent.setStatus('${student.id}', 'late')">
                ${UI.icons.clock} Late
              </button>
              <button 
                type="button" 
                class="att-btn att-btn-absent ${status === 'absent' ? 'active' : ''}" 
                onclick="AttendanceComponent.setStatus('${student.id}', 'absent')">
                ${UI.icons.x} Absent
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.updateStats();
  },

  updateStudentRow(studentId, status) {
    const row = document.getElementById(`att-row-${studentId}`);
    if (!row) return;

    const btns = row.querySelectorAll('.att-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    const activeBtn = row.querySelector(`.att-btn-${status}`);
    if (activeBtn) activeBtn.classList.add('active');
  },

  updateStats() {
    const students = this.getFilteredStudents();
    const total = students.length;
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    students.forEach(s => {
      const status = this.currentRecords[s.id] || 'present';
      if (status === 'present') presentCount++;
      else if (status === 'late') lateCount++;
      else if (status === 'absent') absentCount++;
    });

    const percent = total > 0 ? Math.round(((presentCount + (lateCount * 0.75)) / total) * 100) : 0;

    const totalEl = document.getElementById('att-stat-total');
    const presentEl = document.getElementById('att-stat-present');
    const lateEl = document.getElementById('att-stat-late');
    const absentEl = document.getElementById('att-stat-absent');
    const percentEl = document.getElementById('att-stat-percentage');

    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = presentCount;
    if (lateEl) lateEl.textContent = lateCount;
    if (absentEl) absentEl.textContent = absentCount;
    if (percentEl) percentEl.textContent = `${percent}%`;
  }
};
