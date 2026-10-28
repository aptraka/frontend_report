import {
  SCHEDULE_STATUSES,
  ATTENDANCE_STATUSES,
  GRADES,
  DEFAULT_GRADE_RATES,
} from '../types/constants.js';

/**
 * Strict Payroll Eligibility Evaluator
 * Business Rule:
 * Valid: Schedule Status === 'Submitted' AND Attendance Status === 'Attended'
 * Invalid (Exclude): Schedule in 'Draft'/'Cancelled' OR Attendance in 'Scheduled'/'Absent'
 *
 * @param {string} scheduleStatus
 * @param {string} attendanceStatus
 * @returns {{ isEligible: boolean, reason: string, code: 'VALID' | 'DRAFT' | 'CANCELLED' | 'ABSENT' | 'SCHEDULED' | 'UNKNOWN' }}
 */
export function evaluatePayrollEligibility(scheduleStatus, attendanceStatus) {
  // Check invalid schedule statuses first
  if (scheduleStatus === SCHEDULE_STATUSES.DRAFT) {
    return {
      isEligible: false,
      reason: 'Status Jadwal masih Draft (belum disubmit oleh instruktur)',
      code: 'DRAFT',
    };
  }

  if (scheduleStatus === SCHEDULE_STATUSES.CANCELLED) {
    return {
      isEligible: false,
      reason: 'Jadwal dibatalkan (Cancelled)',
      code: 'CANCELLED',
    };
  }

  // Check invalid attendance statuses
  if (attendanceStatus === ATTENDANCE_STATUSES.SCHEDULED) {
    return {
      isEligible: false,
      reason: 'Sesi belum terlaksana / belum konfirmasi kehadiran (Scheduled)',
      code: 'SCHEDULED',
    };
  }

  if (attendanceStatus === ATTENDANCE_STATUSES.ABSENT) {
    return {
      isEligible: false,
      reason: 'Murid berstatus Tidak Hadir (Absent)',
      code: 'ABSENT',
    };
  }

  // Strict check for valid conditions
  if (
    scheduleStatus === SCHEDULE_STATUSES.SUBMITTED &&
    attendanceStatus === ATTENDANCE_STATUSES.ATTENDED
  ) {
    return {
      isEligible: true,
      reason: 'Memenuhi Syarat Payroll (Submitted & Attended)',
      code: 'VALID',
    };
  }

  return {
    isEligible: false,
    reason: 'Kondisi status tidak memenuhi kriteria payroll',
    code: 'UNKNOWN',
  };
}

/**
 * Merges raw Schedule Documents, Attendance Documents, and Instructor Profiles.
 * Extracts:
 * - teaching_grade FROM Schedule Document
 * - employment_status FROM Instructor Profile
 */
export function joinTeachingSessions(schedules = [], attendances = [], instructors = []) {
  const attendanceMap = new Map();
  attendances.forEach((att) => {
    attendanceMap.set(att.schedule_id, att);
  });

  const instructorMap = new Map();
  instructors.forEach((ins) => {
    instructorMap.set(ins.id, ins);
  });

  return schedules.map((sch) => {
    const attendance = attendanceMap.get(sch.id) || {
      id: `ATT-GEN-${sch.id}`,
      schedule_id: sch.id,
      attendance_status: ATTENDANCE_STATUSES.SCHEDULED,
      check_in_time: null,
      student_notes: 'Belum ada data kehadiran tercatat.',
      verified_by: '-',
    };

    const instructor = instructorMap.get(sch.instructor_id) || {
      id: sch.instructor_id,
      fullName: `Instructor #${sch.instructor_id}`,
      employment_status: 'Freelance',
      department: 'General',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=ins${sch.instructor_id}`,
    };

    // Extract core attributes per business requirements:
    const teaching_grade = sch.teaching_grade || 'Grade 1';
    const employment_status = instructor.employment_status || 'Freelance';

    const eligibility = evaluatePayrollEligibility(sch.status, attendance.attendance_status);

    return {
      id: sch.id,
      schedule_code: sch.schedule_code || sch.id,
      date: sch.date,
      start_time: sch.start_time,
      end_time: sch.end_time,
      room: sch.room,
      subject: sch.subject,
      student_id: sch.student_id,
      student_name: sch.student_name,

      // Schedule Document attributes
      schedule_status: sch.status,
      teaching_grade: teaching_grade,

      // Attendance Document attributes
      attendance_id: attendance.id,
      attendance_status: attendance.attendance_status,
      check_in_time: attendance.check_in_time,
      student_notes: attendance.student_notes,
      verified_by: attendance.verified_by,

      // Instructor Profile attributes
      instructor_id: instructor.id,
      instructor_name: instructor.fullName,
      instructor_email: instructor.email,
      instructor_avatar: instructor.avatar,
      employment_status: employment_status,
      department: instructor.department,

      // Payroll calculation attributes
      is_payroll_eligible: eligibility.isEligible,
      eligibility_reason: eligibility.reason,
      eligibility_code: eligibility.code,
    };
  });
}

/**
 * Calculates Payroll Preparation Recapitulation
 * STRICT RULE: Only sessions where is_payroll_eligible === true are counted!
 *
 * @param {Array} joinedSessions
 * @param {Object} rates Custom or default rate map
 * @returns {Object} Summarized payroll recap and meta
 */
export function calculatePayrollRecap(joinedSessions = [], rates = DEFAULT_GRADE_RATES) {
  // STRICT FILTER: Exclude any session that is not payroll eligible
  const eligibleSessions = joinedSessions.filter((s) => s.is_payroll_eligible);

  // Group by instructor
  const instructorGroups = new Map();

  eligibleSessions.forEach((session) => {
    const { instructor_id, instructor_name, instructor_avatar, employment_status, teaching_grade } = session;

    if (!instructorGroups.has(instructor_id)) {
      instructorGroups.set(instructor_id, {
        instructor_id,
        instructor_name,
        instructor_avatar,
        employment_status,
        grade_breakdown: {
          'Grade 1': 0,
          'Grade 2': 0,
          'Grade 3': 0,
          'Grade 4': 0,
        },
        total_eligible_sessions: 0,
        estimated_amount: 0,
      });
    }

    const current = instructorGroups.get(instructor_id);
    if (GRADES.includes(teaching_grade)) {
      current.grade_breakdown[teaching_grade] = (current.grade_breakdown[teaching_grade] || 0) + 1;
    }
    current.total_eligible_sessions += 1;
  });

  // Calculate estimated compensation amounts for each instructor
  const recapRows = Array.from(instructorGroups.values()).map((row) => {
    let est = 0;
    GRADES.forEach((g) => {
      const count = row.grade_breakdown[g] || 0;
      const rate = rates[g] || DEFAULT_GRADE_RATES[g] || 0;
      est += count * rate;
    });

    return {
      ...row,
      estimated_amount: est,
    };
  });

  // Sort rows alphabetically by instructor name
  recapRows.sort((a, b) => a.instructor_name.localeCompare(b.instructor_name));

  // Compute Grand Totals across all instructors
  const grandTotals = {
    'Grade 1': 0,
    'Grade 2': 0,
    'Grade 3': 0,
    'Grade 4': 0,
    total_eligible_sessions: 0,
    total_estimated_amount: 0,
    total_instructors: recapRows.length,
  };

  recapRows.forEach((row) => {
    GRADES.forEach((g) => {
      grandTotals[g] += row.grade_breakdown[g];
    });
    grandTotals.total_eligible_sessions += row.total_eligible_sessions;
    grandTotals.total_estimated_amount += row.estimated_amount;
  });

  return {
    recapRows,
    grandTotals,
    eligibleSessionsCount: eligibleSessions.length,
    totalSessionsProcessed: joinedSessions.length,
    excludedSessionsCount: joinedSessions.length - eligibleSessions.length,
  };
}
