/**
 * Student Management System - Settings Component
 * Handles institution profile settings, JSON backup export/import, and factory reset.
 */

const SettingsComponent = {
  init() {
    this.loadSettings();
    this.bindEvents();
  },

  loadSettings() {
    const settings = storage.getSettings();

    const nameInput = document.getElementById('settings-inst-name');
    const codeInput = document.getElementById('settings-inst-code');
    const yearInput = document.getElementById('settings-academic-year');
    const semInput = document.getElementById('settings-current-sem');
    const passingInput = document.getElementById('settings-passing-score');

    if (nameInput) nameInput.value = settings.institutionName || 'Apex Institute of Technology';
    if (codeInput) codeInput.value = settings.institutionCode || 'APEX-2026';
    if (yearInput) yearInput.value = settings.academicYear || '2025-2026';
    if (semInput) semInput.value = settings.currentSemester || 'Fall Semester';
    if (passingInput) passingInput.value = settings.passingScore || 50;

    // Update brand title in topbar/sidebar
    this.updateBranding(settings);
  },

  updateBranding(settings) {
    const brandNameEls = document.querySelectorAll('.brand-inst-name');
    brandNameEls.forEach(el => {
      el.textContent = settings.institutionName || 'StudentHub';
    });
  },

  bindEvents() {
    // General Settings Form
    const form = document.getElementById('settings-general-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
          institutionName: document.getElementById('settings-inst-name').value.trim(),
          institutionCode: document.getElementById('settings-inst-code').value.trim(),
          academicYear: document.getElementById('settings-academic-year').value.trim(),
          currentSemester: document.getElementById('settings-current-sem').value.trim(),
          passingScore: Number(document.getElementById('settings-passing-score').value) || 50
        };

        storage.saveSettings(settings);
        this.updateBranding(settings);
        UI.showToast('Institution settings updated successfully.', 'success', 'Settings Saved');
      });
    }

    // Export JSON Data
    const exportBtn = document.getElementById('btn-export-full-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportBackup());
    }

    // Import JSON Data
    const importInput = document.getElementById('import-file-input');
    if (importInput) {
      importInput.addEventListener('change', (e) => this.handleImportFile(e));
    }

    // Reset Default Data Button
    const resetBtn = document.getElementById('btn-factory-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.promptReset());
    }
  },

  exportBackup() {
    const data = storage.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student_management_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    UI.showToast('Full system backup exported as JSON.', 'info', 'Backup Generated');
  },

  handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        storage.importAllData(json);
        UI.showToast('Data imported successfully! Reloading workspace...', 'success', 'Import Complete');
        
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        UI.showToast('Failed to parse the backup file. Please ensure it is valid JSON.', 'error', 'Import Failed');
      }
    };
    reader.readAsText(file);
  },

  promptReset() {
    UI.confirm({
      title: 'Reset to Sample Data',
      message: 'This will reset all student records, marks, and attendance back to the original sample dataset. Any changes made will be overwritten. Do you want to proceed?',
      confirmText: 'Reset Data',
      cancelText: 'Cancel',
      isDanger: true,
      onConfirm: () => {
        storage.resetToDefaults();
        UI.showToast('System data reset to default sample dataset.', 'success', 'Data Reset');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    });
  }
};
