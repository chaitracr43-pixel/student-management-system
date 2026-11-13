/**
 * Student Management System - Student Profile Component
 * Renders rich detailed student profile with academics, attendance, and contact cards.
 */

const StudentProfileComponent = {
  currentStudentId: null,

  show(studentId) {
    const student = storage.getStudentById(studentId);
    if (!student) {
      UI.showToast('Student record could not be found.', 'error');
      return;
    }

    this.currentStudentId = studentId;
    const modalContent = document.getElementById('profile-modal-content');
    if (!modalContent) return;

    const avg = StorageService.calculateStudentAverage(student);
    const grade = StorageService.calculateGrade(avg);
    const marks = student.marks || [];
    const statusClass = student.status === 'Active' ? 'badge-success' : 'badge-neutral';

    modalContent.innerHTML = `
      <!-- Profile Header Banner -->
      <div class="profile-hero">
        <div class="profile-avatar-wrap">
          <img src="${UI.escapeHTML(student.avatar)}" alt="${UI.escapeHTML(student.firstName)}" class="profile-avatar-img" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}'" />
        </div>
        <div class="profile-hero-info">
          <div class="d-flex align-center gap-2 flex-wrap mb-1">
            <h2 class="profile-name">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</h2>
            <span class="badge ${statusClass}">${UI.escapeHTML(student.status || 'Active')}</span>
            <span class="badge badge-dept">${UI.escapeHTML(student.department)}</span>
          </div>
          <div class="profile-meta-row">
            <span><strong>ID:</strong> <code class="font-mono">${UI.escapeHTML(student.id)}</code></span>
            <span>&bull;</span>
            <span><strong>Enrolled:</strong> ${UI.formatDate(student.enrollmentDate)}</span>
            <span>&bull;</span>
            <span><strong>Age:</strong> ${student.age || 'N/A'} yrs</span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="profile-metrics-bar">
        <div class="metric-box">
          <div class="metric-title">Overall Attendance</div>
          <div class="metric-val text-primary">${student.attendance || 0}%</div>
          <div class="progress-bar-wrap mt-1">
            <div class="progress-bar-fill ${student.attendance >= 85 ? 'bg-success' : student.attendance >= 70 ? 'bg-warning' : 'bg-danger'}" style="width: ${student.attendance || 0}%"></div>
          </div>
        </div>
        <div class="metric-box">
          <div class="metric-title">Academic Score</div>
          <div class="metric-val">${avg}%</div>
          <div class="text-xs text-muted mt-1">Weighted average across subjects</div>
        </div>
        <div class="metric-box">
          <div class="metric-title">Performance Grade</div>
          <div class="metric-val text-${grade.color}">${grade.letter}</div>
          <div class="text-xs font-mono mt-1">GPA: ${grade.gpa} / 4.0</div>
        </div>
      </div>

      <!-- Profile Grid Details -->
      <div class="profile-grid">
        <!-- Personal & Contact Card -->
        <div class="profile-card">
          <h4 class="card-section-title">${UI.icons.users} Personal Information</h4>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">${UI.formatDate(student.dob)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender</span>
              <span class="info-value">${UI.escapeHTML(student.gender || 'Not specified')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value"><a href="mailto:${UI.escapeHTML(student.email)}">${UI.escapeHTML(student.email || 'N/A')}</a></span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-value">${UI.escapeHTML(student.phone || 'N/A')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Residential Address</span>
              <span class="info-value">${UI.escapeHTML(student.address || 'Not on file')}</span>
            </div>
          </div>

          <h4 class="card-section-title mt-4">${UI.icons.shieldCheck} Guardian & Emergency</h4>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Guardian Name</span>
              <span class="info-value">${UI.escapeHTML(student.guardianName || 'N/A')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Guardian Phone</span>
              <span class="info-value">${UI.escapeHTML(student.guardianPhone || 'N/A')}</span>
            </div>
          </div>
        </div>

        <!-- Academic & Marks Card -->
        <div class="profile-card">
          <div class="d-flex align-center justify-between mb-3">
            <h4 class="card-section-title m-0">${UI.icons.award} Subject Marks & Performance</h4>
            <button class="btn btn-sm btn-outline" onclick="StudentProfileComponent.quickAddMark()">
              ${UI.icons.plus} Add Subject
            </button>
          </div>

          ${marks.length === 0 ? `
            <div class="text-center py-4 text-muted">
              <p>No subject marks recorded yet.</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th class="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${marks.map(m => {
                    const mGrade = StorageService.calculateGrade(m.score);
                    return `
                      <tr>
                        <td class="fw-500">${UI.escapeHTML(m.subject)}</td>
                        <td class="font-mono">${m.score} / 100</td>
                        <td><span class="badge badge-${mGrade.color}">${mGrade.letter}</span></td>
                        <td class="text-right">
                          <button class="btn-icon text-danger" title="Remove Subject Mark" onclick="StudentProfileComponent.deleteMark('${UI.escapeHTML(m.subject)}')">
                            ${UI.icons.trash}
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}

          <div class="grade-summary-box mt-3">
            <div class="d-flex justify-between align-center">
              <div>
                <div class="fw-600">Semester GPA: ${grade.gpa}</div>
                <div class="text-xs text-muted">Status: ${grade.status}</div>
              </div>
              <div class="text-right">
                <span class="badge badge-${grade.color} fs-6">${grade.letter}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Set modal action buttons
    const editBtn = document.getElementById('profile-modal-edit-btn');
    const deleteBtn = document.getElementById('profile-modal-delete-btn');
    const printBtn = document.getElementById('profile-modal-print-btn');

    if (editBtn) {
      editBtn.onclick = () => {
        UI.closeModal('view-student-modal');
        StudentFormComponent.editStudent(student.id);
      };
    }

    if (deleteBtn) {
      deleteBtn.onclick = () => {
        UI.closeModal('view-student-modal');
        StudentsComponent.promptDelete(student.id);
      };
    }

    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    UI.openModal('view-student-modal');
  },

  quickAddMark() {
    const student = storage.getStudentById(this.currentStudentId);
    if (!student) return;

    const subjects = storage.getSubjects();
    const existingSubjects = (student.marks || []).map(m => m.subject);
    const availableSubjects = subjects.filter(s => !existingSubjects.includes(s.name));

    if (availableSubjects.length === 0) {
      UI.showToast('All standard subjects already have marks entered for this student.', 'info');
      return;
    }

    const subjectName = availableSubjects[0].name;
    const scoreStr = prompt(`Enter mark for "${subjectName}" (0-100):`, '85');
    if (scoreStr === null) return;

    const score = parseInt(scoreStr, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      UI.showToast('Please enter a valid number between 0 and 100.', 'error');
      return;
    }

    storage.addOrUpdateMark(this.currentStudentId, subjectName, score);
    UI.showToast(`Mark for ${subjectName} saved!`, 'success');
    this.show(this.currentStudentId);
    StudentsComponent.render();
    DashboardComponent.render();
  },

  deleteMark(subjectName) {
    storage.deleteStudentMark(this.currentStudentId, subjectName);
    UI.showToast(`Removed marks for ${subjectName}.`, 'info');
    this.show(this.currentStudentId);
    StudentsComponent.render();
    DashboardComponent.render();
  }
};
