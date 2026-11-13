/**
 * Student Management System - Dashboard Component
 * Renders KPI cards, Chart.js visualizations, and recent student activities.
 */

const DashboardComponent = {
  charts: {
    deptChart: null,
    attendanceChart: null,
    gradeChart: null
  },

  render() {
    const stats = storage.getDashboardStats();
    
    // Update KPI Metric Values
    const totalEl = document.getElementById('stat-total-students');
    const maleEl = document.getElementById('stat-male-students');
    const femaleEl = document.getElementById('stat-female-students');
    const attendanceEl = document.getElementById('stat-avg-attendance');
    const marksEl = document.getElementById('stat-avg-marks');

    if (totalEl) totalEl.textContent = stats.total;
    if (maleEl) maleEl.textContent = stats.male;
    if (femaleEl) femaleEl.textContent = stats.female;
    if (attendanceEl) attendanceEl.textContent = `${stats.avgAttendance}%`;
    if (marksEl) marksEl.textContent = `${stats.avgMarks}%`;

    // Render Charts
    this.renderCharts(stats);

    // Render Recent Students
    this.renderRecentStudents(stats.recentStudents);
  },

  renderCharts(stats) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet');
      return;
    }

    // 1. Department Distribution (Doughnut)
    const deptCtx = document.getElementById('chart-departments');
    if (deptCtx) {
      if (this.charts.deptChart) this.charts.deptChart.destroy();

      const labels = Object.keys(stats.deptMap);
      const data = Object.values(stats.deptMap);
      const colors = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

      this.charts.deptChart = new Chart(deptCtx, {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [{
            data: data.length ? data : [1],
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 14,
                font: { family: 'Inter', size: 12, weight: 500 }
              }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              padding: 10,
              cornerRadius: 8
            }
          },
          cutout: '68%'
        }
      });
    }

    // 2. Attendance Overview (Bar chart)
    const attendanceCtx = document.getElementById('chart-attendance');
    if (attendanceCtx) {
      if (this.charts.attendanceChart) this.charts.attendanceChart.destroy();

      const students = storage.getStudents();
      // Bucket attendance: 90-100%, 80-89%, 70-79%, <70%
      const attendanceBuckets = { '90-100%': 0, '80-89%': 0, '70-79%': 0, '<70%': 0 };
      students.forEach(s => {
        const att = Number(s.attendance || 0);
        if (att >= 90) attendanceBuckets['90-100%']++;
        else if (att >= 80) attendanceBuckets['80-89%']++;
        else if (att >= 70) attendanceBuckets['70-79%']++;
        else attendanceBuckets['<70%']++;
      });

      this.charts.attendanceChart = new Chart(attendanceCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(attendanceBuckets),
          datasets: [{
            label: 'Students',
            data: Object.values(attendanceBuckets),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1e293b', cornerRadius: 8 }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0, font: { family: 'Inter' } },
              grid: { color: '#f1f5f9' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Inter' } }
            }
          }
        }
      });
    }

    // 3. Performance & Grade Breakdown (Bar chart)
    const gradeCtx = document.getElementById('chart-grades');
    if (gradeCtx) {
      if (this.charts.gradeChart) this.charts.gradeChart.destroy();

      this.charts.gradeChart = new Chart(gradeCtx, {
        type: 'bar',
        data: {
          labels: ['A+ (90-100)', 'A (80-89)', 'B (70-79)', 'C (60-69)', 'D (50-59)', 'F (<50)'],
          datasets: [{
            label: 'Students Count',
            data: [
              stats.gradeDist['A+'],
              stats.gradeDist['A'],
              stats.gradeDist['B'],
              stats.gradeDist['C'],
              stats.gradeDist['D'],
              stats.gradeDist['F']
            ],
            backgroundColor: ['#10b981', '#34d399', '#3b82f6', '#f59e0b', '#fb923c', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1e293b', cornerRadius: 8 }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0, font: { family: 'Inter' } },
              grid: { color: '#f1f5f9' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }
  },

  renderRecentStudents(recentList) {
    const tbody = document.getElementById('dashboard-recent-table');
    if (!tbody) return;

    if (!recentList || recentList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">No student records found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = recentList.map(student => {
      const avg = StorageService.calculateStudentAverage(student);
      const grade = StorageService.calculateGrade(avg);
      const statusBadge = student.status === 'Active' ? 'badge-success' : 'badge-neutral';
      
      return `
        <tr>
          <td>
            <div class="user-avatar-cell">
              <img src="${UI.escapeHTML(student.avatar)}" alt="${UI.escapeHTML(student.firstName)}" class="avatar-sm" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}'" />
              <div>
                <div class="fw-600">${UI.escapeHTML(student.firstName)} ${UI.escapeHTML(student.lastName)}</div>
                <div class="text-xs text-muted">${UI.escapeHTML(student.id)}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-dept">${UI.escapeHTML(student.department)}</span></td>
          <td>
            <div class="d-flex align-center gap-2">
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill ${student.attendance >= 85 ? 'bg-success' : student.attendance >= 70 ? 'bg-warning' : 'bg-danger'}" style="width: ${student.attendance || 0}%"></div>
              </div>
              <span class="text-sm font-mono">${student.attendance || 0}%</span>
            </div>
          </td>
          <td>
            <span class="badge badge-${grade.color}">${avg}% (${grade.letter})</span>
          </td>
          <td>
            <span class="badge ${statusBadge}">${UI.escapeHTML(student.status || 'Active')}</span>
          </td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline" onclick="StudentProfileComponent.show('${student.id}')" title="View Profile">
              ${UI.icons.eye} View
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
};
