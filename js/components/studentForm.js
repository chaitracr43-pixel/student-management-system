/**
 * Student Management System - Student Form Component
 * Handles adding new students and editing existing student records with validation.
 */

const StudentFormComponent = {
  isEditing: false,
  editingStudentId: null,

  init() {
    this.bindEvents();
    this.populateDepartmentSelect();
  },

  populateDepartmentSelect() {
    const deptSelect = document.getElementById('student-form-dept');
    if (deptSelect) {
      const depts = storage.getDepartments();
      deptSelect.innerHTML = '<option value="">Select Department / Class</option>' +
        depts.map(d => `<option value="${UI.escapeHTML(d.name)}">${UI.escapeHTML(d.name)}</option>`).join('');
    }
  },

  bindEvents() {
    const form = document.getElementById('student-record-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Avatar preview update
    const avatarInput = document.getElementById('student-form-avatar');
    const avatarPreview = document.getElementById('form-avatar-preview');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          avatarPreview.src = val;
        } else {
          avatarPreview.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=preview';
        }
      });
    }

    // Preset Avatar buttons
    const avatarPresets = document.querySelectorAll('.avatar-preset-btn');
    avatarPresets.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const seed = btn.getAttribute('data-seed') || 'student';
        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        if (avatarInput) avatarInput.value = url;
        if (avatarPreview) avatarPreview.src = url;
      });
    });

    // Reset button
    const resetBtn = document.getElementById('btn-reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetForm());
    }
  },

  setAddMode() {
    this.isEditing = false;
    this.editingStudentId = null;

    const titleEl = document.getElementById('student-form-page-title');
    const submitBtn = document.getElementById('btn-submit-student');
    const idInput = document.getElementById('student-form-id');

    if (titleEl) titleEl.textContent = 'Add New Student';
    if (submitBtn) submitBtn.innerHTML = `${UI.icons.userPlus} Save Student`;
    
    this.resetForm();
    if (idInput) {
      idInput.value = storage.generateNextStudentId();
      idInput.readOnly = false;
    }
    this.populateDepartmentSelect();
  },

  editStudent(studentId) {
    const student = storage.getStudentById(studentId);
    if (!student) {
      UI.showToast('Student not found.', 'error');
      return;
    }

    this.isEditing = true;
    this.editingStudentId = studentId;

    // Switch view to Add/Edit view
    App.navigate('add-student');

    const titleEl = document.getElementById('student-form-page-title');
    const submitBtn = document.getElementById('btn-submit-student');
    if (titleEl) titleEl.textContent = `Edit Student: ${student.firstName} ${student.lastName}`;
    if (submitBtn) submitBtn.innerHTML = `${UI.icons.check} Update Student Record`;

    this.populateDepartmentSelect();

    // Populate Fields
    document.getElementById('student-form-id').value = student.id || '';
    document.getElementById('student-form-id').readOnly = true;
    document.getElementById('student-form-firstname').value = student.firstName || '';
    document.getElementById('student-form-lastname').value = student.lastName || '';
    document.getElementById('student-form-dob').value = student.dob || '';
    document.getElementById('student-form-gender').value = student.gender || 'Male';
    document.getElementById('student-form-email').value = student.email || '';
    document.getElementById('student-form-phone').value = student.phone || '';
    document.getElementById('student-form-address').value = student.address || '';
    document.getElementById('student-form-dept').value = student.department || '';
    document.getElementById('student-form-enrollment').value = student.enrollmentDate || '';
    document.getElementById('student-form-guardian-name').value = student.guardianName || '';
    document.getElementById('student-form-guardian-phone').value = student.guardianPhone || '';
    document.getElementById('student-form-status').value = student.status || 'Active';
    
    const avatarInput = document.getElementById('student-form-avatar');
    const avatarPreview = document.getElementById('form-avatar-preview');
    if (avatarInput) avatarInput.value = student.avatar || '';
    if (avatarPreview) avatarPreview.src = student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}`;
  },

  resetForm() {
    const form = document.getElementById('student-record-form');
    if (form) form.reset();

    const avatarPreview = document.getElementById('form-avatar-preview');
    if (avatarPreview) avatarPreview.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=new';

    const idInput = document.getElementById('student-form-id');
    if (idInput && !this.isEditing) {
      idInput.value = storage.generateNextStudentId();
    }

    // Clear validation error highlights
    const errorEls = document.querySelectorAll('.form-control-error');
    errorEls.forEach(el => el.classList.remove('form-control-error'));
  },

  validate(data) {
    const errors = [];
    if (!data.id) errors.push('Student ID is required');
    if (!data.firstName) errors.push('First Name is required');
    if (!data.lastName) errors.push('Last Name is required');
    if (!data.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!data.department) errors.push('Class / Department is required');

    return errors;
  },

  handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('student-form-id').value.trim();
    const firstName = document.getElementById('student-form-firstname').value.trim();
    const lastName = document.getElementById('student-form-lastname').value.trim();
    const dob = document.getElementById('student-form-dob').value;
    const gender = document.getElementById('student-form-gender').value;
    const email = document.getElementById('student-form-email').value.trim();
    const phone = document.getElementById('student-form-phone').value.trim();
    const address = document.getElementById('student-form-address').value.trim();
    const department = document.getElementById('student-form-dept').value;
    const enrollmentDate = document.getElementById('student-form-enrollment').value || new Date().toISOString().split('T')[0];
    const guardianName = document.getElementById('student-form-guardian-name').value.trim();
    const guardianPhone = document.getElementById('student-form-guardian-phone').value.trim();
    const status = document.getElementById('student-form-status').value || 'Active';
    const avatar = document.getElementById('student-form-avatar').value.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;

    const studentData = {
      id,
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      address,
      department,
      enrollmentDate,
      guardianName,
      guardianPhone,
      status,
      avatar
    };

    const errors = this.validate(studentData);
    if (errors.length > 0) {
      UI.showToast(errors[0], 'error', 'Validation Error');
      return;
    }

    // Check duplicate ID when adding
    if (!this.isEditing) {
      const existing = storage.getStudentById(id);
      if (existing) {
        UI.showToast(`Student ID "${id}" is already in use. Please choose another.`, 'error', 'Duplicate ID');
        return;
      }
    }

    // Save to storage
    storage.saveStudent(studentData);

    const message = this.isEditing 
      ? `Student ${firstName} ${lastName} was successfully updated.` 
      : `Student ${firstName} ${lastName} has been added successfully.`;

    UI.showToast(message, 'success', this.isEditing ? 'Record Updated' : 'Student Added');

    // Reset form and navigate to Students list
    this.resetForm();
    App.navigate('students');
    DashboardComponent.render();
  }
};
