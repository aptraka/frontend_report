import * as XLSX from 'xlsx';
import { formatDateIndo } from './dateUtils.js';
import { GRADES, DEFAULT_GRADE_RATES } from '../types/constants.js';

/**
 * Generates and downloads a clean, professional Excel workbook (.xlsx)
 * designed specifically for the Finance Department's payroll processing.
 *
 * @param {Object} payrollData Output from calculatePayrollRecap
 * @param {Array} eligibleSessions List of individual eligible sessions for audit sheet
 * @param {Object} filterMeta Active filter metadata (date range, instructor filter, etc.)
 */
export function exportPayrollToExcel(payrollData, eligibleSessions = [], filterMeta = {}) {
  const { recapRows = [], grandTotals = {} } = payrollData;

  const startDateText = filterMeta.startDate ? formatDateIndo(filterMeta.startDate) : 'Awal';
  const endDateText = filterMeta.endDate ? formatDateIndo(filterMeta.endDate) : 'Akhir';
  const periodText = (!filterMeta.startDate && !filterMeta.endDate)
    ? 'Semua Periode Data'
    : `${startDateText} s/d ${endDateText}`;

  // -------------------------------------------------------------
  // SHEET 1: REKAPITULASI PAYROLL (Summary for Finance)
  // -------------------------------------------------------------
  const summaryAoa = [
    ['REKAPITULASI PERSIAPAN PAYROLL INSTRUKTUR'],
    ['INSTRUCTOR ATTENDANCE & PAYROLL PREPARATION DASHBOARD'],
    [],
    ['Periode Cut-Off:', periodText],
    ['Tanggal Ekspor:', new Date().toLocaleString('id-ID')],
    ['Kriteria Validasi:', 'Schedule Status = SUBMITTED & Attendance Status = ATTENDED'],
    ['Catatan untuk Finance:', 'Kolom "Tarif Estimasi (Rp)" dapat diisi/disesuaikan dengan skema honor per kategori.'],
    [],
    // Table Header
    [
      'No',
      'Nama Instruktur',
      'Status Kepegawaian',
      'Sesi Grade 1',
      'Sesi Grade 2',
      'Sesi Grade 3',
      'Sesi Grade 4',
      'Total Sesi Eligible',
      'Estimasi Honor (Rp)',
      'Tanda Tangan / Persetujuan Finance',
    ],
  ];

  recapRows.forEach((row, idx) => {
    summaryAoa.push([
      idx + 1,
      row.instructor_name,
      row.employment_status,
      row.grade_breakdown['Grade 1'] || 0,
      row.grade_breakdown['Grade 2'] || 0,
      row.grade_breakdown['Grade 3'] || 0,
      row.grade_breakdown['Grade 4'] || 0,
      row.total_eligible_sessions,
      row.estimated_amount,
      'Pending Review Finance',
    ]);
  });

  // Grand Total Row
  summaryAoa.push([
    '',
    'TOTAL KESELURUHAN',
    `${grandTotals.total_instructors || recapRows.length} Instruktur`,
    grandTotals['Grade 1'] || 0,
    grandTotals['Grade 2'] || 0,
    grandTotals['Grade 3'] || 0,
    grandTotals['Grade 4'] || 0,
    grandTotals.total_eligible_sessions || 0,
    grandTotals.total_estimated_amount || 0,
    '',
  ]);

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryAoa);

  // Column width styling
  summarySheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Nama Instruktur
    { wch: 20 }, // Status Kepegawaian
    { wch: 14 }, // Grade 1
    { wch: 14 }, // Grade 2
    { wch: 14 }, // Grade 3
    { wch: 14 }, // Grade 4
    { wch: 18 }, // Total Sesi
    { wch: 22 }, // Estimasi Honor
    { wch: 30 }, // Tanda Tangan
  ];

  // -------------------------------------------------------------
  // SHEET 2: AUDIT TRAIL SESI VALID (Detailed Eligible Sessions)
  // -------------------------------------------------------------
  const auditAoa = [
    ['DETAIL LOG SESI MENGAJAR VALID (AUDIT TRAIL PAYROLL)'],
    ['Hanya mencantumkan sesi yang berstatus Schedule = Submitted dan Attendance = Attended'],
    [],
    [
      'No',
      'ID Jadwal',
      'Tanggal',
      'Waktu',
      'Nama Instruktur',
      'Status Kepegawaian',
      'Teaching Grade',
      'Nama Murid',
      'Mata Pelajaran / Topik',
      'Status Jadwal',
      'Status Kehadiran',
      'Waktu Check-In',
      'Catatan / Evaluasi',
      'Verifikator',
    ],
  ];

  eligibleSessions.forEach((s, idx) => {
    auditAoa.push([
      idx + 1,
      s.schedule_code,
      s.date,
      `${s.start_time || ''} - ${s.end_time || ''}`,
      s.instructor_name,
      s.employment_status,
      s.teaching_grade,
      s.student_name,
      s.subject,
      s.schedule_status,
      s.attendance_status,
      s.check_in_time || '-',
      s.student_notes || '-',
      s.verified_by || '-',
    ]);
  });

  const auditSheet = XLSX.utils.aoa_to_sheet(auditAoa);

  auditSheet['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 14 },
    { wch: 16 },
    { wch: 26 },
    { wch: 18 },
    { wch: 14 },
    { wch: 22 },
    { wch: 32 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 45 },
    { wch: 24 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rekap_Payroll_Finance');
  XLSX.utils.book_append_sheet(workbook, auditSheet, 'Audit_Log_Sesi_Valid');

  // Generate file name
  const safeStart = filterMeta.startDate ? filterMeta.startDate.replace(/-/g, '') : 'ALL';
  const safeEnd = filterMeta.endDate ? filterMeta.endDate.replace(/-/g, '') : 'PERIOD';
  const fileName = `Rekapitulasi_Payroll_Instruktur_${safeStart}_${safeEnd}.xlsx`;

  // Download trigger
  XLSX.writeFile(workbook, fileName);
}
