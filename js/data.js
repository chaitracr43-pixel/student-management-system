/**
 * Student Management System - Mock Data
 * Initial realistic sample dataset for demonstration and local testing.
 */

const INITIAL_DEPARTMENTS = [
  {
    id: 'cs',
    name: 'Computer Science',
    code: 'CS',
    icon: 'code',
    hod: 'Dr. Robert Vance',
    facultyCount: 14,
    description: 'Software engineering, algorithms, AI, and systems architecture.'
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    icon: 'network',
    hod: 'Prof. Sarah Jenkins',
    facultyCount: 10,
    description: 'Network infrastructure, cybersecurity, cloud, and database management.'
  },
  {
    id: 'ds',
    name: 'Data Science',
    code: 'DS',
    icon: 'database',
    hod: 'Dr. Michael Chang',
    facultyCount: 8,
    description: 'Big data analytics, machine learning, statistical modeling, and visualization.'
  },
  {
    id: 'ece',
    name: 'Electrical Engineering',
    code: 'EE',
    icon: 'cpu',
    hod: 'Dr. Elena Rostova',
    facultyCount: 12,
    description: 'Embedded systems, robotics, microelectronics, and signal processing.'
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    code: 'ME',
    icon: 'settings',
    hod: 'Prof. David Miller',
    facultyCount: 11,
    description: 'Thermodynamics, fluid mechanics, CAD design, and automation.'
  },
  {
    id: 'ba',
    name: 'Business Administration',
    code: 'BA',
    icon: 'briefcase',
    hod: 'Dr. Amanda Brooks',
    facultyCount: 9,
    description: 'Strategic management, financial analytics, marketing, and leadership.'
  }
];

const INITIAL_SUBJECTS = [
  { id: 'sub_math', name: 'Mathematics & Calculus', code: 'MATH-101' },
  { id: 'sub_prog', name: 'Data Structures & Algorithms', code: 'CS-201' },
  { id: 'sub_db', name: 'Database Systems', code: 'CS-204' },
  { id: 'sub_phy', name: 'Applied Physics', code: 'PHY-102' },
  { id: 'sub_eng', name: 'Technical English & Communication', code: 'ENG-105' },
  { id: 'sub_ai', name: 'Artificial Intelligence & ML', code: 'DS-301' }
];

const INITIAL_STUDENTS = [
  {
    id: 'STU-1001',
    firstName: 'Alex',
    lastName: 'Rivera',
    gender: 'Male',
    dob: '2004-03-15',
    age: 20,
    department: 'Computer Science',
    email: 'alex.rivera@campus.edu',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Carlos Rivera',
    guardianPhone: '+1 (555) 234-9988',
    attendance: 94,
    marks: [
      { subject: 'Mathematics & Calculus', score: 92 },
      { subject: 'Data Structures & Algorithms', score: 95 },
      { subject: 'Database Systems', score: 88 },
      { subject: 'Technical English & Communication', score: 85 }
    ]
  },
  {
    id: 'STU-1002',
    firstName: 'Sophia',
    lastName: 'Chen',
    gender: 'Female',
    dob: '2003-11-20',
    age: 21,
    department: 'Data Science',
    email: 'sophia.chen@campus.edu',
    phone: '+1 (555) 345-6789',
    address: '128 Silicon Blvd, San Jose, CA',
    enrollmentDate: '2021-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Li Wei Chen',
    guardianPhone: '+1 (555) 345-1122',
    attendance: 98,
    marks: [
      { subject: 'Mathematics & Calculus', score: 96 },
      { subject: 'Artificial Intelligence & ML', score: 98 },
      { subject: 'Database Systems', score: 92 },
      { subject: 'Technical English & Communication', score: 90 }
    ]
  },
  {
    id: 'STU-1003',
    firstName: 'Marcus',
    lastName: 'Johnson',
    gender: 'Male',
    dob: '2004-07-09',
    age: 20,
    department: 'Information Technology',
    email: 'marcus.j@campus.edu',
    phone: '+1 (555) 456-7890',
    address: '404 Oakridge Ave, Austin, TX',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Theresa Johnson',
    guardianPhone: '+1 (555) 456-3344',
    attendance: 86,
    marks: [
      { subject: 'Database Systems', score: 78 },
      { subject: 'Data Structures & Algorithms', score: 82 },
      { subject: 'Applied Physics', score: 74 },
      { subject: 'Technical English & Communication', score: 80 }
    ]
  },
  {
    id: 'STU-1004',
    firstName: 'Emily',
    lastName: 'Davis',
    gender: 'Female',
    dob: '2005-01-28',
    age: 19,
    department: 'Electrical Engineering',
    email: 'emily.davis@campus.edu',
    phone: '+1 (555) 567-8901',
    address: '89 Beacon Hill Rd, Boston, MA',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Arthur Davis',
    guardianPhone: '+1 (555) 567-4455',
    attendance: 91,
    marks: [
      { subject: 'Applied Physics', score: 89 },
      { subject: 'Mathematics & Calculus', score: 91 },
      { subject: 'Data Structures & Algorithms', score: 79 },
      { subject: 'Technical English & Communication', score: 86 }
    ]
  },
  {
    id: 'STU-1005',
    firstName: 'Liam',
    lastName: 'Smith',
    gender: 'Male',
    dob: '2003-05-14',
    age: 21,
    department: 'Mechanical Engineering',
    email: 'liam.smith@campus.edu',
    phone: '+1 (555) 678-9012',
    address: '512 Lakeview Dr, Chicago, IL',
    enrollmentDate: '2021-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Brenda Smith',
    guardianPhone: '+1 (555) 678-5566',
    attendance: 79,
    marks: [
      { subject: 'Applied Physics', score: 72 },
      { subject: 'Mathematics & Calculus', score: 68 },
      { subject: 'Database Systems', score: 75 },
      { subject: 'Technical English & Communication', score: 70 }
    ]
  },
  {
    id: 'STU-1006',
    firstName: 'Aisha',
    lastName: 'Patel',
    gender: 'Female',
    dob: '2004-09-03',
    age: 20,
    department: 'Computer Science',
    email: 'aisha.patel@campus.edu',
    phone: '+1 (555) 789-0123',
    address: '320 University Pkwy, Seattle, WA',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Rajesh Patel',
    guardianPhone: '+1 (555) 789-6677',
    attendance: 96,
    marks: [
      { subject: 'Data Structures & Algorithms', score: 94 },
      { subject: 'Mathematics & Calculus', score: 93 },
      { subject: 'Database Systems', score: 91 },
      { subject: 'Technical English & Communication', score: 88 }
    ]
  },
  {
    id: 'STU-1007',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    gender: 'Male',
    dob: '2004-12-11',
    age: 20,
    department: 'Business Administration',
    email: 'carlos.r@campus.edu',
    phone: '+1 (555) 890-1234',
    address: '610 Coral Way, Miami, FL',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Maria Rodriguez',
    guardianPhone: '+1 (555) 890-7788',
    attendance: 88,
    marks: [
      { subject: 'Technical English & Communication', score: 92 },
      { subject: 'Mathematics & Calculus', score: 81 },
      { subject: 'Database Systems', score: 84 },
      { subject: 'Applied Physics', score: 76 }
    ]
  },
  {
    id: 'STU-1008',
    firstName: 'Olivia',
    lastName: 'Taylor',
    gender: 'Female',
    dob: '2005-04-18',
    age: 19,
    department: 'Data Science',
    email: 'olivia.taylor@campus.edu',
    phone: '+1 (555) 901-2345',
    address: '15 Maple St, Denver, CO',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Gregory Taylor',
    guardianPhone: '+1 (555) 901-8899',
    attendance: 95,
    marks: [
      { subject: 'Artificial Intelligence & ML', score: 94 },
      { subject: 'Mathematics & Calculus', score: 89 },
      { subject: 'Database Systems', score: 93 },
      { subject: 'Technical English & Communication', score: 91 }
    ]
  },
  {
    id: 'STU-1009',
    firstName: 'Ethan',
    lastName: 'Wright',
    gender: 'Male',
    dob: '2003-08-25',
    age: 21,
    department: 'Computer Science',
    email: 'ethan.wright@campus.edu',
    phone: '+1 (555) 012-3456',
    address: '920 Pinecrest Lane, Atlanta, GA',
    enrollmentDate: '2021-09-01',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Walter Wright',
    guardianPhone: '+1 (555) 012-9900',
    attendance: 64,
    marks: [
      { subject: 'Data Structures & Algorithms', score: 62 },
      { subject: 'Mathematics & Calculus', score: 58 },
      { subject: 'Database Systems', score: 65 },
      { subject: 'Technical English & Communication', score: 71 }
    ]
  },
  {
    id: 'STU-1010',
    firstName: 'Mia',
    lastName: 'Wilson',
    gender: 'Female',
    dob: '2004-06-30',
    age: 20,
    department: 'Information Technology',
    email: 'mia.wilson@campus.edu',
    phone: '+1 (555) 123-7890',
    address: '235 Sunset Blvd, Los Angeles, CA',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Sarah Wilson',
    guardianPhone: '+1 (555) 123-4321',
    attendance: 92,
    marks: [
      { subject: 'Database Systems', score: 89 },
      { subject: 'Data Structures & Algorithms', score: 86 },
      { subject: 'Mathematics & Calculus', score: 84 },
      { subject: 'Technical English & Communication', score: 90 }
    ]
  },
  {
    id: 'STU-1011',
    firstName: 'Noah',
    lastName: 'Garcia',
    gender: 'Male',
    dob: '2005-02-14',
    age: 19,
    department: 'Mechanical Engineering',
    email: 'noah.garcia@campus.edu',
    phone: '+1 (555) 234-8901',
    address: '770 Magnolia Ave, Dallas, TX',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Juan Garcia',
    guardianPhone: '+1 (555) 234-7654',
    attendance: 87,
    marks: [
      { subject: 'Applied Physics', score: 85 },
      { subject: 'Mathematics & Calculus', score: 80 },
      { subject: 'Database Systems', score: 79 },
      { subject: 'Technical English & Communication', score: 82 }
    ]
  },
  {
    id: 'STU-1012',
    firstName: 'Isabella',
    lastName: 'Martinez',
    gender: 'Female',
    dob: '2004-10-05',
    age: 20,
    department: 'Business Administration',
    email: 'isabella.m@campus.edu',
    phone: '+1 (555) 345-9012',
    address: '415 Broadway, New York, NY',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Helena Martinez',
    guardianPhone: '+1 (555) 345-8765',
    attendance: 97,
    marks: [
      { subject: 'Technical English & Communication', score: 95 },
      { subject: 'Mathematics & Calculus', score: 88 },
      { subject: 'Database Systems', score: 90 },
      { subject: 'Applied Physics', score: 87 }
    ]
  },
  {
    id: 'STU-1013',
    firstName: 'Lucas',
    lastName: 'Brown',
    gender: 'Male',
    dob: '2003-12-19',
    age: 21,
    department: 'Electrical Engineering',
    email: 'lucas.brown@campus.edu',
    phone: '+1 (555) 456-0123',
    address: '380 Chestnut St, Philadelphia, PA',
    enrollmentDate: '2021-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Patrick Brown',
    guardianPhone: '+1 (555) 456-9876',
    attendance: 84,
    marks: [
      { subject: 'Applied Physics', score: 81 },
      { subject: 'Mathematics & Calculus', score: 76 },
      { subject: 'Data Structures & Algorithms', score: 83 },
      { subject: 'Technical English & Communication', score: 78 }
    ]
  },
  {
    id: 'STU-1014',
    firstName: 'Chloe',
    lastName: 'Anderson',
    gender: 'Female',
    dob: '2005-08-12',
    age: 19,
    department: 'Computer Science',
    email: 'chloe.a@campus.edu',
    phone: '+1 (555) 567-1234',
    address: '620 Cedar Rd, Portland, OR',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Richard Anderson',
    guardianPhone: '+1 (555) 567-0987',
    attendance: 93,
    marks: [
      { subject: 'Data Structures & Algorithms', score: 92 },
      { subject: 'Mathematics & Calculus', score: 90 },
      { subject: 'Database Systems', score: 89 },
      { subject: 'Technical English & Communication', score: 94 }
    ]
  },
  {
    id: 'STU-1015',
    firstName: 'David',
    lastName: 'Kim',
    gender: 'Male',
    dob: '2004-01-17',
    age: 20,
    department: 'Data Science',
    email: 'david.kim@campus.edu',
    phone: '+1 (555) 678-2345',
    address: '808 Bellevue Way, Bellevue, WA',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Min-Soo Kim',
    guardianPhone: '+1 (555) 678-1098',
    attendance: 90,
    marks: [
      { subject: 'Artificial Intelligence & ML', score: 91 },
      { subject: 'Mathematics & Calculus', score: 87 },
      { subject: 'Database Systems', score: 85 },
      { subject: 'Technical English & Communication', score: 82 }
    ]
  },
  {
    id: 'STU-1016',
    firstName: 'Emma',
    lastName: 'Thomas',
    gender: 'Female',
    dob: '2004-05-22',
    age: 20,
    department: 'Information Technology',
    email: 'emma.thomas@campus.edu',
    phone: '+1 (555) 789-3456',
    address: '144 Highland St, Phoenix, AZ',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Rebecca Thomas',
    guardianPhone: '+1 (555) 789-2109',
    attendance: 89,
    marks: [
      { subject: 'Database Systems', score: 84 },
      { subject: 'Data Structures & Algorithms', score: 79 },
      { subject: 'Mathematics & Calculus', score: 81 },
      { subject: 'Technical English & Communication', score: 88 }
    ]
  },
  {
    id: 'STU-1017',
    firstName: 'James',
    lastName: 'Jackson',
    gender: 'Male',
    dob: '2003-09-10',
    age: 21,
    department: 'Mechanical Engineering',
    email: 'james.j@campus.edu',
    phone: '+1 (555) 890-4567',
    address: '530 Riverfront St, Nashville, TN',
    enrollmentDate: '2021-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Frank Jackson',
    guardianPhone: '+1 (555) 890-3210',
    attendance: 82,
    marks: [
      { subject: 'Applied Physics', score: 77 },
      { subject: 'Mathematics & Calculus', score: 74 },
      { subject: 'Database Systems', score: 76 },
      { subject: 'Technical English & Communication', score: 80 }
    ]
  },
  {
    id: 'STU-1018',
    firstName: 'Ava',
    lastName: 'White',
    gender: 'Female',
    dob: '2005-03-07',
    age: 19,
    department: 'Business Administration',
    email: 'ava.white@campus.edu',
    phone: '+1 (555) 901-5678',
    address: '902 Ocean Ave, San Diego, CA',
    enrollmentDate: '2023-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Judith White',
    guardianPhone: '+1 (555) 901-4321',
    attendance: 96,
    marks: [
      { subject: 'Technical English & Communication', score: 96 },
      { subject: 'Mathematics & Calculus', score: 90 },
      { subject: 'Database Systems', score: 92 },
      { subject: 'Applied Physics', score: 88 }
    ]
  },
  {
    id: 'STU-1019',
    firstName: 'Benjamin',
    lastName: 'Harris',
    gender: 'Male',
    dob: '2004-11-02',
    age: 20,
    department: 'Electrical Engineering',
    email: 'ben.harris@campus.edu',
    phone: '+1 (555) 012-6789',
    address: '318 Park Ave, Minneapolis, MN',
    enrollmentDate: '2022-09-01',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Donald Harris',
    guardianPhone: '+1 (555) 012-5432',
    attendance: 68,
    marks: [
      { subject: 'Applied Physics', score: 65 },
      { subject: 'Mathematics & Calculus', score: 60 },
      { subject: 'Data Structures & Algorithms', score: 70 },
      { subject: 'Technical English & Communication', score: 72 }
    ]
  },
  {
    id: 'STU-1020',
    firstName: 'Harper',
    lastName: 'Lewis',
    gender: 'Female',
    dob: '2004-08-16',
    age: 20,
    department: 'Computer Science',
    email: 'harper.lewis@campus.edu',
    phone: '+1 (555) 123-0987',
    address: '470 Elmwood Terrace, Raleigh, NC',
    enrollmentDate: '2022-09-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    guardianName: 'Valerie Lewis',
    guardianPhone: '+1 (555) 123-8765',
    attendance: 95,
    marks: [
      { subject: 'Data Structures & Algorithms', score: 96 },
      { subject: 'Mathematics & Calculus', score: 94 },
      { subject: 'Database Systems', score: 93 },
      { subject: 'Technical English & Communication', score: 91 }
    ]
  }
];

const INITIAL_SETTINGS = {
  institutionName: 'Apex Institute of Technology',
  institutionCode: 'APEX-2026',
  academicYear: '2025-2026',
  currentSemester: 'Fall Semester',
  passingScore: 50,
  enableEmailAlerts: true,
  theme: 'light'
};
