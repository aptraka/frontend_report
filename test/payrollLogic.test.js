import assert from 'node:assert';
import {
  evaluatePayrollEligibility,
  joinTeachingSessions,
  calculatePayrollRecap,
} from '../src/utils/payrollLogic.js';
import { isDateInRange } from '../src/utils/dateUtils.js';

console.log('🧪 Starting Automated Unit Tests for Business Logic & Payroll Rules...\n');

// 1. Test evaluatePayrollEligibility
console.log('1. Testing evaluatePayrollEligibility() strict conditions:');

const validTest = evaluatePayrollEligibility('Submitted', 'Attended');
assert.strictEqual(validTest.isEligible, true, 'Submitted + Attended MUST be eligible');
assert.strictEqual(validTest.code, 'VALID');
console.log('  ✓ [PASS] Submitted + Attended -> VALID (Eligible)');

const draftTest = evaluatePayrollEligibility('Draft', 'Attended');
assert.strictEqual(draftTest.isEligible, false, 'Draft + Attended MUST be excluded');
assert.strictEqual(draftTest.code, 'DRAFT');
console.log('  ✓ [PASS] Draft + Attended -> DRAFT (Excluded)');

const cancelledTest = evaluatePayrollEligibility('Cancelled', 'Attended');
assert.strictEqual(cancelledTest.isEligible, false, 'Cancelled + Attended MUST be excluded');
assert.strictEqual(cancelledTest.code, 'CANCELLED');
console.log('  ✓ [PASS] Cancelled + Attended -> CANCELLED (Excluded)');

const absentTest = evaluatePayrollEligibility('Submitted', 'Absent');
assert.strictEqual(absentTest.isEligible, false, 'Submitted + Absent MUST be excluded');
assert.strictEqual(absentTest.code, 'ABSENT');
console.log('  ✓ [PASS] Submitted + Absent -> ABSENT (Excluded)');

const scheduledTest = evaluatePayrollEligibility('Submitted', 'Scheduled');
assert.strictEqual(scheduledTest.isEligible, false, 'Submitted + Scheduled MUST be excluded');
assert.strictEqual(scheduledTest.code, 'SCHEDULED');
console.log('  ✓ [PASS] Submitted + Scheduled -> SCHEDULED (Excluded)');

// 2. Test joinTeachingSessions data relation extraction
console.log('\n2. Testing joinTeachingSessions() data relationships:');

const mockSchedules = [
  {
    id: 'SCH-01',
    instructor_id: 101,
    student_name: 'Budi',
    teaching_grade: 'Grade 3', // From schedule document
    status: 'Submitted',
    date: '2026-10-15',
  },
  {
    id: 'SCH-02',
    instructor_id: 101,
    student_name: 'Dewi',
    teaching_grade: 'Grade 1',
    status: 'Draft',
    date: '2026-10-16',
  },
];

const mockAttendances = [
  {
    schedule_id: 'SCH-01',
    attendance_status: 'Attended',
    check_in_time: '09:00',
  },
  {
    schedule_id: 'SCH-02',
    attendance_status: 'Attended',
    check_in_time: '10:00',
  },
];

const mockInstructors = [
  {
    id: 101,
    fullName: 'Dr. Sarah Connor',
    employment_status: 'Full-time', // From instructor profile
    avatar: 'avatar.png',
  },
];

const joined = joinTeachingSessions(mockSchedules, mockAttendances, mockInstructors);

assert.strictEqual(joined.length, 2);
assert.strictEqual(joined[0].teaching_grade, 'Grade 3', 'Teaching Grade must be extracted from Schedule Document');
assert.strictEqual(joined[0].employment_status, 'Full-time', 'Employment Status must be extracted from Instructor Profile');
assert.strictEqual(joined[0].is_payroll_eligible, true, 'SCH-01 (Submitted + Attended) must be eligible');
assert.strictEqual(joined[1].is_payroll_eligible, false, 'SCH-02 (Draft) must be excluded');
console.log('  ✓ [PASS] Data relations (Teaching Grade from Schedule, Employment Status from Profile) verified');
console.log('  ✓ [PASS] Joined sessions eligibility evaluated properly');

// 3. Test calculatePayrollRecap STRICT inclusion
console.log('\n3. Testing calculatePayrollRecap() strict filtering:');

const recap = calculatePayrollRecap(joined);
assert.strictEqual(recap.eligibleSessionsCount, 1, 'Only 1 session must be counted as eligible');
assert.strictEqual(recap.excludedSessionsCount, 1, '1 session must be excluded');
assert.strictEqual(recap.recapRows.length, 1);
assert.strictEqual(recap.recapRows[0].total_eligible_sessions, 1);
assert.strictEqual(recap.recapRows[0].grade_breakdown['Grade 3'], 1);
assert.strictEqual(recap.recapRows[0].grade_breakdown['Grade 1'], 0, 'Grade 1 from Draft session must NOT be counted');
assert.strictEqual(recap.grandTotals.total_eligible_sessions, 1);
console.log('  ✓ [PASS] Payroll recap STRICTLY counts only eligible sessions');
console.log('  ✓ [PASS] Draft and ineligible sessions are excluded from grade counters');

// 4. Test date range filtering
console.log('\n4. Testing isDateInRange():');
assert.strictEqual(isDateInRange('2026-10-15', '2026-10-01', '2026-10-31'), true);
assert.strictEqual(isDateInRange('2026-09-30', '2026-10-01', '2026-10-31'), false);
assert.strictEqual(isDateInRange('2026-11-01', '2026-10-01', '2026-10-31'), false);
console.log('  ✓ [PASS] Date range filter logic functions accurately');

console.log('\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY! 100% VERIFIED.\n');
