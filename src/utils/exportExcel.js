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
    ['REKAPITULASI JUMLAH PERTEMUAN PAYROLL INSTRUKTUR (UNTUK TIM FINANCE)'],
    ['INSTRUCTOR MANAGER ATTENDANCE & PAYROLL PREPARATION DASHBOARD'],
    [],
    ['Periode Cut-Off:', periodText],
    ['Divalidasi Oleh:', 'Instructor Manager'],
    ['Tanggal Ekspor:', new Date().toLocaleString('id-ID')],
    ['Kriteria Validasi:', 'Schedule Status = SUBMITTED & Attendance Status = ATTENDED'],
    ['Catatan Validasi:', 'Laporan mengajar bukan otomatis dibayar. Sesi absen, kelas dibatalkan, draft, dan duplikat telah dikecualikan.'],
    ['Instruksi Finance:', 'File ini menyajikan jumlah pertemuan per kategori yang siap diisi tarif (rate) per pertemuan oleh Tim Finance.'],
    [],
    // Table Header
    [
      'No',
      'Nama Instruktur',
      'Status Kepegawaian',
      'Pertemuan Grade 1',
      'Pertemuan Grade 2',
      'Pertemuan Grade 3',
      'Pertemuan Grade 4',
      'Total Pertemuan Memenuhi Syarat',
      'Tarif per Pertemuan (Rp) [Diisi Finance]',
      'Total Pembayaran Honor (Rp) [Simulasi]',
      'Verifikasi / Tanda Tangan Tim Finance',
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
      '', // Kosong siap diisi oleh Tim Finance
      row.estimated_amount,
      'Pending Approval Finance',
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
    '-',
    grandTotals.total_estimated_amount || 0,
    '',
  ]);

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryAoa);

  // Column width styling
  summarySheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 28 }, // Nama Instruktur
    { wch: 20 }, // Status Kepegawaian
    { wch: 18 }, // Grade 1
    { wch: 18 }, // Grade 2
    { wch: 18 }, // Grade 3
    { wch: 18 }, // Grade 4
    { wch: 32 }, // Total Sesi
    { wch: 35 }, // Tarif per Pertemuan (Diisi Finance)
    { wch: 30 }, // Total Pembayaran Honor
    { wch: 35 }, // Verifikasi / Tanda Tangan
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
