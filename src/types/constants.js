/**
 * Core Business Domain Constants for Instructor Attendance & Payroll Preparation
 */

export const GRADES = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
];

export const EMPLOYMENT_STATUSES = [
  'Full-time',
  'Part-time',
  'Freelance',
];

export const SCHEDULE_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  CANCELLED: 'Cancelled',
};

export const ATTENDANCE_STATUSES = {
  SCHEDULED: 'Scheduled',
  ATTENDED: 'Attended',
  ABSENT: 'Absent',
};

export const PAYROLL_RULES = {
  REQUIRED_SCHEDULE_STATUS: SCHEDULE_STATUSES.SUBMITTED,
  REQUIRED_ATTENDANCE_STATUS: ATTENDANCE_STATUSES.ATTENDED,
};

// Default indicative compensation rates (in IDR) for financial simulation preview
export const DEFAULT_GRADE_RATES = {
  'Grade 1': 75000,
  'Grade 2': 90000,
  'Grade 3': 110000,
  'Grade 4': 135000,
};
