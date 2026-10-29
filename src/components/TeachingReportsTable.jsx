import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { formatDateIndo } from '../utils/dateUtils';

export default function TeachingReportsTable({
  sessions = [],
  onSelectSession,
  activeTab,
  onTabChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter based on sub-tab (All, Eligible, Excluded)
  const displayedSessions = sessions.filter((s) => {
    if (activeTab === 'eligible') return s.is_payroll_eligible;
    if (activeTab === 'excluded') return !s.is_payroll_eligible;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(displayedSessions.length / itemsPerPage));
  const paginatedSessions = displayedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getScheduleStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getAttendanceStatusBadge = (status) => {
    switch (status) {
      case 'Attended':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'Grade 1':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Grade 2':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Grade 3':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Grade 4':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="teaching-reports-section" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-20">
      {/* Table Header & Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Laporan Pertemuan Murid (Instructor Teaching Reports)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumen jadwal dan laporan kehadiran murid yang dibuat oleh instruktur — bukan otomatis dihitung sebagai pertemuan yang dibayar
              </p>
            </div>
          </div>
        </div>

        {/* Status Category Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              onTabChange('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => {
              onTabChange('eligible');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'eligible'
                ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Disetujui ({sessions.filter((s) => s.is_payroll_eligible).length})
          </button>
          <button
            type="button"
            onClick={() => {
              onTabChange('excluded');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'excluded'
                ? 'bg-white text-rose-800 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Dikecualikan ({sessions.filter((s) => !s.is_payroll_eligible).length})
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-3.5 text-center w-10">No</th>
              <th className="py-3 px-3.5">Tanggal & Sesi</th>
              <th className="py-3 px-4">Instruktur</th>
              <th className="py-3 px-4">Murid & Materi</th>
              <th className="py-3 px-3 text-center">Teaching Grade</th>
              <th className="py-3 px-3 text-center">Status Jadwal</th>
              <th className="py-3 px-3 text-center">Status Kehadiran</th>
              <th className="py-3 px-4 text-center">Status Payroll</th>
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {paginatedSessions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm font-semibold text-slate-600">
                      Tidak ada data laporan pertemuan
                    </p>
                    <p className="text-xs text-slate-400">
                      Sesuaikan kriteria filter atau tab status di atas.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedSessions.map((session, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3.5 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                      {globalIndex}
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 text-xs">
                        {formatDateIndo(session.date)}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.start_time} - {session.end_time}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {session.schedule_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={session.instructor_avatar}
                          alt={session.instructor_name}
                          className="w-7 h-7 rounded-full bg-slate-100 object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">
                            {session.instructor_name}
                          </p>
                          <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {session.employment_status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 text-xs">
                        {session.student_name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]" title={session.subject}>
                        {session.subject}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getGradeBadge(
                          session.teaching_grade
                        )}`}
                      >
                        {session.teaching_grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getScheduleStatusBadge(
                          session.schedule_status
                        )}`}
                      >
                        {session.schedule_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getAttendanceStatusBadge(
                          session.attendance_status
                        )}`}
                      >
                        {session.attendance_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {session.is_payroll_eligible ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Eligible</span>
                        </div>
                      ) : (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium"
                          title={session.eligibility_reason}
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>
                            {session.is_duplicate ? 'Duplikat (Excluded)' : 'Excluded'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectSession(session)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-colors"
                        title="Lihat dokumen jadwal & presensi lengkap"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {displayedSessions.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                displayedSessions.length
              )}
            </span>{' '}
            hingga{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * itemsPerPage, displayedSessions.length)}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-700">
              {displayedSessions.length}
            </span>{' '}
            laporan pertemuan
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
