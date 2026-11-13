/**
 * Student Management System - Storage Service
 * LocalStorage wrapper that manages all data persistence and business logic.
 */

const STORAGE_KEYS = {
  STUDENTS: 'sms_students_data',
  DEPARTMENTS: 'sms_departments_data',
  SUBJECTS: 'sms_subjects_data',
  ATTENDANCE: 'sms_attendance_data',
  SETTINGS: 'sms_settings_data',
  INITIALIZED: 'sms_app_initialized'
};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    
    // Seed initial attendance data for today & recent dates
    const today = new Date().toISOString().split('T')[0];
    const initialAttendance = {};
    initialAttendance[today] = {};
    INITIAL_STUDENTS.forEach((student, index) => {
      // Mock realistic status: 85% present, 10% late, 5% absent
      const rand = (index % 10);
      let status = 'present';
      if (rand === 8) status = 'late';
      if (rand === 9) status = 'absent';
      initialAttendance[today][student.id] = status;
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // --- Student CRUD ---

  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading students:', e);
      return [];
    }
  }

  getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === id) || null;
  }

  saveStudent(studentData) {
    const students = this.getStudents();
    const existingIndex = students.findIndex(s => s.id === studentData.id);

    // Compute age if DOB is provided
    if (studentData.dob) {
      const birthDate = new Date(studentData.dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      studentData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    if (existingIndex >= 0) {
      // Update existing student, preserve marks and attendance if not provided
      const current = students[existingIndex];
      students[existingIndex] = {
        ...current,
        ...studentData,
        marks: studentData.marks || current.marks || [],
        attendance: studentData.attendance !== undefined ? studentData.attendance : (current.attendance || 90)
      };
    } else {
      // Create new student
      const newStudent = {
        marks: [],
        attendance: 95,
        status: 'Active',
        avatar: studentData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.firstName || 'student'}`,
        ...studentData
      };
      students.unshift(newStudent);
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return studentData;
  }

  deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    
    // Clean up student from attendance
    const attendance = this.getAllAttendance();
    Object.keys(attendance).forEach(date => {
      if (attendance[date] && attendance[date][id]) {
        delete attendance[date][id];
      }
    });
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    return true;
  }

  generateNextStudentId() {
    const students = this.getStudents();
    let maxNum = 1000;
    students.forEach(s => {
      const match = s.id && s.id.match(/STU-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `STU-${maxNum + 1}`;
  }

  // --- Departments & Subjects ---

  getDepartments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      const depts = data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
      const students = this.getStudents();

      // Dynamically attach live stats to departments
      return depts.map(d => {
        const deptStudents = students.filter(s => s.department === d.name);
        let totalMarks = 0;
        let markCount = 0;
        deptStudents.forEach(s => {
          if (s.marks && s.marks.length > 0) {
            const sum = s.marks.reduce((acc, m) => acc + Number(m.score), 0);
            totalMarks += sum / s.marks.length;
            markCount++;
          }
        });
        const avgScore = markCount > 0 ? (totalMarks / markCount).toFixed(1) : 85.0;

        return {
          ...d,
          studentCount: deptStudents.length,
          averageScore: avgScore
        };
      });
    } catch (e) {
      return INITIAL_DEPARTMENTS;
    }
  }

  getSubjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : INITIAL_SUBJECTS;
    } catch (e) {
      return INITIAL_SUBJECTS;
    }
  }

  // --- Attendance ---

  getAllAttendance() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  getAttendanceForDate(date) {
    const all = this.getAllAttendance();
    return all[date] || {};
  }

  saveAttendance(date, recordMap) {
    const all = this.getAllAttendance();
    all[date] = { ...(all[date] || {}), ...recordMap };
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));

    // Update students overall attendance percentage dynamically
    this.recalculateAllStudentsAttendance();
    return true;
  }

  recalculateAllStudentsAttendance() {
    const all = this.getAllAttendance();
    const students = this.getStudents();
    const dates = Object.keys(all);
    
    if (dates.length === 0) return;

    students.forEach(student => {
      let totalDays = 0;
      let presentDays = 0;

      dates.forEach(d => {
        const dayRecord = all[d];
        if (dayRecord && dayRecord[student.id]) {
          totalDays++;
          if (dayRecord[student.id] === 'present') {
            presentDays += 1;
          } else if (dayRecord[student.id] === 'late') {
            presentDays += 0.75;
          }
        }
      });

      if (totalDays > 0) {
        student.attendance = Math.round((presentDays / totalDays) * 100);
      }
    });

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  // --- Marks & Grades ---

  saveStudentMarks(studentId, marksArray) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    student.marks = marksArray;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  }

  addOrUpdateMark(studentId, subjectName, score) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    student.marks = student.marks || [];
    const existingIndex = student.marks.findIndex(m => m.subject === subjectName);
    
    if (existingIndex >= 0) {
      student.marks[existingIndex].score = Number(score);
    } else {
      student.marks.push({ subject: subjectName, score: Number(score) });
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  }

  deleteStudentMark(studentId, subjectName) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student || !student.marks) return false;

    student.marks = student.marks.filter(m => m.subject !== subjectName);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  }

  // --- Helper Calculations & Statistics ---

  static calculateGrade(score) {
    const num = Number(score);
    if (num >= 90) return { letter: 'A+', gpa: '4.0', color: 'success', status: 'Excellent' };
    if (num >= 80) return { letter: 'A', gpa: '3.7', color: 'success', status: 'Very Good' };
    if (num >= 70) return { letter: 'B', gpa: '3.0', color: 'primary', status: 'Good' };
    if (num >= 60) return { letter: 'C', gpa: '2.0', color: 'warning', status: 'Average' };
    if (num >= 50) return { letter: 'D', gpa: '1.0', color: 'warning', status: 'Pass' };
    return { letter: 'F', gpa: '0.0', color: 'danger', status: 'Fail' };
  }

  static calculateStudentAverage(student) {
    if (!student || !student.marks || student.marks.length === 0) return 0;
    const total = student.marks.reduce((acc, m) => acc + Number(m.score || 0), 0);
    return Math.round(total / student.marks.length);
  }

  getDashboardStats() {
    const students = this.getStudents();
    const total = students.length;
    const male = students.filter(s => s.gender && s.gender.toLowerCase() === 'male').length;
    const female = students.filter(s => s.gender && s.gender.toLowerCase() === 'female').length;
    const other = total - (male + female);

    // Average attendance
    let totalAttendance = 0;
    students.forEach(s => {
      totalAttendance += Number(s.attendance || 0);
    });
    const avgAttendance = total > 0 ? Math.round(totalAttendance / total) : 0;

    // Average marks
    let totalMarksSum = 0;
    let studentsWithMarks = 0;
    students.forEach(s => {
      const avg = StorageService.calculateStudentAverage(s);
      if (avg > 0) {
        totalMarksSum += avg;
        studentsWithMarks++;
      }
    });
    const avgMarks = studentsWithMarks > 0 ? Math.round(totalMarksSum / studentsWithMarks) : 0;

    // Department breakdown
    const deptMap = {};
    students.forEach(s => {
      const dept = s.department || 'Unassigned';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    // Grade breakdown
    const gradeDist = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    students.forEach(s => {
      const avg = StorageService.calculateStudentAverage(s);
      if (avg > 0) {
        const gradeInfo = StorageService.calculateGrade(avg);
        if (gradeDist[gradeInfo.letter] !== undefined) {
          gradeDist[gradeInfo.letter]++;
        }
      }
    });

    // Recent students (last 5 enrolled or added)
    const recentStudents = [...students].slice(0, 5);

    return {
      total,
      male,
      female,
      other,
      avgAttendance,
      avgMarks,
      deptMap,
      gradeDist,
      recentStudents
    };
  }

  // --- Settings & Export/Import ---

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }

  exportAllData() {
    return {
      students: this.getStudents(),
      departments: this.getDepartments(),
      subjects: this.getSubjects(),
      attendance: this.getAllAttendance(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  importAllData(jsonObj) {
    if (!jsonObj || !Array.isArray(jsonObj.students)) {
      throw new Error('Invalid JSON format for Student Management data');
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(jsonObj.students));
    if (jsonObj.departments) localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(jsonObj.departments));
    if (jsonObj.subjects) localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(jsonObj.subjects));
    if (jsonObj.attendance) localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(jsonObj.attendance));
    if (jsonObj.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(jsonObj.settings));
    return true;
  }
}

// Create singleton instance
const storage = new StorageService();
