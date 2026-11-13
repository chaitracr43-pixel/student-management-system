/**
 * Student Management System - Departments Component
 * Renders department overview cards, faculty details, and department statistics.
 */

const DepartmentsComponent = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('departments-grid-container');
    if (!container) return;

    const depts = storage.getDepartments();

    container.innerHTML = depts.map(dept => {
      const iconSvg = UI.icons[dept.icon] || UI.icons.building;

      return `
        <div class="dept-card">
          <div class="dept-card-header">
            <div class="dept-icon-box">${iconSvg}</div>
            <span class="badge badge-dept font-mono">${UI.escapeHTML(dept.code)}</span>
          </div>

          <h3 class="dept-title">${UI.escapeHTML(dept.name)}</h3>
          <p class="dept-desc">${UI.escapeHTML(dept.description)}</p>

          <div class="dept-stats-row">
            <div class="dept-stat">
              <div class="stat-number">${dept.studentCount || 0}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="dept-stat">
              <div class="stat-number">${dept.facultyCount || 0}</div>
              <div class="stat-label">Faculty</div>
            </div>
            <div class="dept-stat">
              <div class="stat-number">${dept.averageScore}%</div>
              <div class="stat-label">Avg Marks</div>
            </div>
          </div>

          <div class="dept-hod-box">
            <div class="text-xs text-muted">Head of Department</div>
            <div class="fw-600 text-sm">${UI.escapeHTML(dept.hod)}</div>
          </div>

          <div class="dept-card-footer">
            <button class="btn btn-outline btn-block" onclick="DepartmentsComponent.viewDepartmentStudents('${UI.escapeHTML(dept.name)}')">
              ${UI.icons.users} View Enrolled Students
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  viewDepartmentStudents(deptName) {
    App.navigate('students');
    const filterSelect = document.getElementById('filter-department');
    if (filterSelect) {
      filterSelect.value = deptName;
      StudentsComponent.state.departmentFilter = deptName;
      StudentsComponent.render();
    }
  }
};
