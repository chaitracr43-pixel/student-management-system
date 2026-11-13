/**
 * Student Management System - Main App Orchestrator
 * Handles client-side routing, global search, mobile navigation, and lifecycle.
 */

const App = {
  currentPage: 'dashboard',

  init() {
    // Initialize components
    StudentsComponent.init();
    StudentFormComponent.init();
    AttendanceComponent.init();
    GradesComponent.init();
    DepartmentsComponent.init();
    SettingsComponent.init();

    // Bind navigation & router
    this.bindNavigation();
    this.bindGlobalSearch();
    this.bindNotifications();
    this.bindMobileDrawer();

    // Handle initial route from URL hash
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  },

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(hash, false);
  },

  navigate(pageId, updateHash = true) {
    const validPages = ['dashboard', 'students', 'add-student', 'attendance', 'grades', 'departments', 'settings'];
    if (!validPages.includes(pageId)) {
      pageId = 'dashboard';
    }

    this.currentPage = pageId;

    if (updateHash && window.location.hash !== `#${pageId}`) {
      window.location.hash = pageId;
    }

    // Hide all views
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => v.classList.remove('active'));

    // Show target view
    const targetView = document.getElementById(`${pageId}-view`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update active nav links in sidebar
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Topbar Title
    this.updateTopbar(pageId);

    // Trigger page-specific component render
    this.onPageEnter(pageId);

    // Close mobile drawer if open
    this.closeMobileDrawer();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateTopbar(pageId) {
    const titles = {
      dashboard: { title: 'Dashboard Overview', subtitle: 'Academic analytics, metrics, and recent activities' },
      students: { title: 'Student Directory', subtitle: 'Manage student records, search, filter, and export' },
      'add-student': { 
        title: StudentFormComponent.isEditing ? 'Edit Student Record' : 'Enroll New Student', 
        subtitle: 'Fill in the information below to create or update student details' 
      },
      attendance: { title: 'Daily Attendance Register', subtitle: 'Track and mark student presence across classes' },
      grades: { title: 'Academic Marks & Grades', subtitle: 'Enter examination scores and auto-compute GPA & letter grades' },
      departments: { title: 'Departments & Classes', subtitle: 'Overview of academic faculties and departments' },
      settings: { title: 'System Settings', subtitle: 'Configure institution profile and manage data backups' }
    };

    const info = titles[pageId] || titles.dashboard;
    const titleEl = document.getElementById('topbar-page-title');
    const subtitleEl = document.getElementById('topbar-page-subtitle');

    if (titleEl) titleEl.textContent = info.title;
    if (subtitleEl) subtitleEl.textContent = info.subtitle;
  },

  onPageEnter(pageId) {
    switch (pageId) {
      case 'dashboard':
        DashboardComponent.render();
        break;
      case 'students':
        StudentsComponent.render();
        break;
      case 'add-student':
        if (!StudentFormComponent.isEditing) {
          StudentFormComponent.setAddMode();
        }
        break;
      case 'attendance':
        AttendanceComponent.loadRecords();
        break;
      case 'grades':
        GradesComponent.render();
        break;
      case 'departments':
        DepartmentsComponent.render();
        break;
      case 'settings':
        SettingsComponent.loadSettings();
        break;
    }
  },

  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-item[data-page]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page === 'add-student') {
          StudentFormComponent.setAddMode();
        }
        this.navigate(page);
      });
    });

    // Quick action buttons
    const quickAddBtn = document.getElementById('quick-action-add');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        StudentFormComponent.setAddMode();
        this.navigate('add-student');
      });
    }

    const quickAttBtn = document.getElementById('quick-action-att');
    if (quickAttBtn) {
      quickAttBtn.addEventListener('click', () => this.navigate('attendance'));
    }

    const quickGradeBtn = document.getElementById('quick-action-grade');
    if (quickGradeBtn) {
      quickGradeBtn.addEventListener('click', () => this.navigate('grades'));
    }
  },

  bindGlobalSearch() {
    const globalInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');
    if (!globalInput || !resultsContainer) return;

    globalInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
        return;
      }

      const students = storage.getStudents();
      const matches = students.filter(s => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        return fullName.includes(term) || (s.id || '').toLowerCase().includes(term) || (s.department || '').toLowerCase().includes(term);
      }).slice(0, 5);

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div class="search-result-item text-muted">No students matching "${UI.escapeHTML(term)}"</div>`;
        resultsContainer.classList.add('active');
        return;
      }

      resultsContainer.innerHTML = matches.map(s => `
        <div class="search-result-item" onclick="App.handleGlobalSearchResultClick('${s.id}')">
          <img src="${UI.escapeHTML(s.avatar)}" class="avatar-xs" alt="${UI.escapeHTML(s.firstName)}" />
          <div class="search-item-meta">
            <div class="fw-600">${UI.escapeHTML(s.firstName)} ${UI.escapeHTML(s.lastName)}</div>
            <div class="text-xs text-muted">${UI.escapeHTML(s.id)} &bull; ${UI.escapeHTML(s.department)}</div>
          </div>
          <span class="badge badge-dept text-xs">${s.attendance || 0}%</span>
        </div>
      `).join('');

      resultsContainer.classList.add('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!globalInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.classList.remove('active');
      }
    });
  },

  handleGlobalSearchResultClick(studentId) {
    const resultsContainer = document.getElementById('global-search-results');
    const globalInput = document.getElementById('global-search-input');
    if (resultsContainer) resultsContainer.classList.remove('active');
    if (globalInput) globalInput.value = '';

    StudentProfileComponent.show(studentId);
  },

  bindNotifications() {
    const btn = document.getElementById('btn-notifications');
    const panel = document.getElementById('notifications-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('active');
      }
    });

    // Mark as read
    const markReadBtn = document.getElementById('btn-mark-notifications-read');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        const badge = document.getElementById('notifications-count-badge');
        if (badge) badge.style.display = 'none';
        UI.showToast('All notifications marked as read.', 'info');
      });
    }
  },

  bindMobileDrawer() {
    const hamburger = document.getElementById('mobile-hamburger-btn');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-backdrop');

    if (hamburger && sidebar) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.closeMobileDrawer());
    }
  },

  closeMobileDrawer() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
