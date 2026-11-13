/**
 * Student Management System - Marks & Grades Component
 * Records subject scores, auto-calculates percentages, letter grades, and overall GPA.
 */

const GradesComponent = {
  selectedStudentId: null,

  init() {
    this.populateStudentSelect();
    this.populateSubjectSelect();
    this.bindEvents();
  },

  populateStudentSelect() {
    const select = document.getElementById('grades-student-select');
    if (!select) return;

    const students = storage.getStudents();
    select.innerHTML = '<option value="">-- Choose a Student --</option>' +
      students.map(s => `<option value="${s.id}">${UI.escapeHTML(s.id)} - ${UI.escapeHTML(s.firstName)} ${UI.escapeHTML(s.lastName)} (${UI.escapeHTML(s.department)})</option>`).join('');

    if (this.selectedStudentId) {
      select.value = this.selectedStudentId;
    }
  },

  populateSubjectSelect() {
    const select = document.getElementById('grades-subject-select');
    if (!select) return;

    const subjects = storage.getSubjects();
    select.innerHTML = '<option value="">-- Choose Subject --</option>' +
      subjects.map(s => `<option value="${UI.escapeHTML(s.name)}">${UI.escapeHTML(s.code)}: ${UI.escapeHTML(s.name)}</option>`).join('');
  },

  bindEvents() {
    const studentSelect = document.getElementById('grades-student-select');
    if (studentSelect) {
      studentSelect.addEventListener('change', (e) => {
        this.selectedStudentId = e.target.value;
        this.renderStudentGradeCard();
      });
    }

    const marksInput = document.getElementById('grades-score-input');
    if (marksInput) {
      marksInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.updateLiveGradePreview(val);
      });
    }

    const form = document.getElementById('record-marks-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSaveMark(e));
    }
  },

  updateLiveGradePreview(score) {
    const previewEl = document.getElementById('live-grade-preview');
    if (!previewEl) return;

    if (score === '' || isNaN(score)) {
      previewEl.innerHTML = '<span class="text-muted">Enter marks (0-100) to preview grade</span>';
      return;
    }

    const num = Number(score);
    if (num < 0 || num > 100) {
      previewEl.innerHTML = '<span class="text-danger">Invalid score: must be 0 - 100</span>';
      return;
    }

    const grade = StorageService.calculateGrade(num);
    previewEl.innerHTML = `
      <div class="d-flex align-center gap-2">
        <span class="badge badge-${grade.color} fs-6">${grade.letter} (${grade.status})</span>
        <span class="text-sm font-mono text-muted">GPA: ${grade.gpa}</span>
      </div>
    `;
  },

  handleSaveMark(e) {
    e.preventDefault();

    if (!this.selectedStudentId) {
      UI.showToast('Please select a student first.', 'warning');
      return;
    }

    const subject = document.getElementById('grades-subject-select').value;
    if (!subject) {
      UI.showToast('Please select a subject.', 'warning');
      return;
    }

    const scoreInput = document.getElementById('grades-score-input');
    const score = Number(scoreInput.value);

    if (isNaN(score) || score < 0 || score > 100) {
      UI.showToast('Score must be a number between 0 and 100.', 'error');
      return;
    }

    storage.addOrUpdateMark(this.selectedStudentId, subject, score);
    UI.showToast(`Mark for ${subject} recorded successfully!`, 'success');

    // Reset input
    scoreInput.value = '';
    this.updateLiveGradePreview('');
    this.renderStudentGradeCard();
    this.renderClassSummaryTable();
    DashboardComponent.render();
  },

  selectStudent(studentId) {
    this.selectedStudentId = studentId;
    const select = document.getElementById('grades-student-select');
    if (select) select.value = studentId;
    this.renderStudentGradeCard();
  },

  renderStudentGradeCard() {
    const container = document.getElementById('selected-student-grades-container');
    if (!container) return;

    if (!this.selectedStudentId) {
      container.innerHTML = `
        <div class="empty-state py-5">
          <div class="empty-icon">${UI.icons.award}</div>
          <h4>Select a Student</h4>
          <p class="text-muted">Choose a student from the dropdown above to view or enter subject marks.</p>
        </div>
      `;
      return;
    }

    const student = storage.getStudentById(this.selectedStudentId);
    if (!student) {
      container.innerHTML = `<div class="alert alert-danger">Student not found.</div>`;
      return;
    }

    const marks = student.marks || [];
    const avg = StorageService.calculateStudentAverage(student);
    const overallGrade = StorageService.calculateGrade(avg);

    container.innerHTML = `
      <div class="card p-4 mb-4">
        <div class="d-flex justify-between align-center flex-wrap gap-3 pb-3 border-bottom">
          <div class="user-avatar-cell">
            <img src="${UI.escapeHTML(student.avatar)}" alt="${UI.escapeHTML(student.firstName)}" class="avatar-md" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}'" />
            <div>
              <h3 class="m-0">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</h3>
              <div class="text-muted text-sm">${UI.escapeHTML(student.id)} &bull; ${UI.escapeHTML(student.department)}</div>
            </div>
          </div>
          <div class="d-flex align-center gap-3">
            <div class="text-right">
              <div class="text-xs text-muted">AVERAGE SCORE</div>
              <div class="fs-4 fw-700 text-primary">${avg}%</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-muted">OVERALL GRADE</div>
              <span class="badge badge-${overallGrade.color} fs-6">${overallGrade.letter}</span>
            </div>
          </div>
        </div>

        <div class="table-responsive mt-3">
          <table class="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks (Out of 100)</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Performance</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${marks.length === 0 ? `
                <tr>
                  <td colspan="6" class="text-center py-4 text-muted">No marks recorded yet for this student.</td>
                </tr>
              ` : marks.map(m => {
                const g = StorageService.calculateGrade(m.score);
                return `
                  <tr>
                    <td class="fw-600">${UI.escapeHTML(m.subject)}</td>
                    <td class="font-mono">${m.score} / 100</td>
                    <td>
                      <div class="d-flex align-center gap-2">
                        <div class="progress-bar-wrap" style="width: 80px;">
                          <div class="progress-bar-fill ${m.score >= 80 ? 'bg-success' : m.score >= 60 ? 'bg-primary' : m.score >= 50 ? 'bg-warning' : 'bg-danger'}" style="width: ${m.score}%"></div>
                        </div>
                        <span class="text-sm font-mono">${m.score}%</span>
                      </div>
                    </td>
                    <td><span class="badge badge-${g.color}">${g.letter}</span></td>
                    <td class="text-muted text-sm">${g.status}</td>
                    <td class="text-right">
                      <button class="btn-icon text-danger" title="Delete Mark" onclick="GradesComponent.deleteMark('${UI.escapeHTML(m.subject)}')">
                        ${UI.icons.trash}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  deleteMark(subjectName) {
    if (!this.selectedStudentId) return;
    storage.deleteStudentMark(this.selectedStudentId, subjectName);
    UI.showToast(`Removed marks for ${subjectName}.`, 'info');
    this.renderStudentGradeCard();
    this.renderClassSummaryTable();
    DashboardComponent.render();
  },

  renderClassSummaryTable() {
    const tbody = document.getElementById('grades-class-summary-table');
    if (!tbody) return;

    const students = storage.getStudents();
    tbody.innerHTML = students.map(student => {
      const avg = StorageService.calculateStudentAverage(student);
      const grade = StorageService.calculateGrade(avg);
      const subjectCount = (student.marks || []).length;

      return `
        <tr>
          <td class="font-mono fw-600 text-primary">${UI.escapeHTML(student.id)}</td>
          <td>
            <div class="fw-600">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</div>
          </td>
          <td><span class="badge badge-dept">${UI.escapeHTML(student.department)}</span></td>
          <td class="font-mono">${subjectCount}</td>
          <td class="font-mono fw-600">${avg}%</td>
          <td><span class="badge badge-${grade.color}">${grade.letter}</span></td>
          <td>${grade.gpa}</td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline" onclick="GradesComponent.selectStudent('${student.id}')">
              ${UI.icons.edit} Manage Marks
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  render() {
    this.populateStudentSelect();
    this.populateSubjectSelect();
    this.renderStudentGradeCard();
    this.renderClassSummaryTable();
  }
};
