import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { formatDateIndo } from '../utils/dateUtils';

export default function SessionDetailModal({ session, onClose }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Detail Dokumen Pertemuan & Presensi
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {session.schedule_code} • {session.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Payroll Decision Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              session.is_payroll_eligible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {session.is_payroll_eligible ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>
                  {session.is_payroll_eligible
                    ? 'Status: Lolos Verifikasi Payroll'
                    : 'Status: Dikecualikan dari Payroll'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-current">
                  {session.eligibility_code}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-90">
                {session.eligibility_reason}
              </p>
              <div className="mt-2 text-[11px] opacity-75 font-mono">
                Validasi: Schedule Status = {session.schedule_status} | Attendance Status = {session.attendance_status}
              </div>
            </div>
          </div>

          {/* Grid: 2 Columns for Schedule Document vs Attendance Document */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Schedule Document */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Dokumen Jadwal Murid
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    session.schedule_status === 'Submitted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : session.schedule_status === 'Draft'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {session.schedule_status}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Teaching Grade (Jadwal)
                  </span>
                  <span className="font-bold text-blue-800 text-xs">
                    {session.teaching_grade}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tanggal Pertemuan
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatDateIndo(session.date)} ({session.date})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Waktu & Ruangan
                  </span>
                  <span className="font-medium text-slate-800">
                    {session.start_time} - {session.end_time} • {session.room || 'Ruang Kelas'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Murid & Topik
                  </span>
                  <p className="font-bold text-slate-900">{session.student_name}</p>
                  <p className="text-slate-600 italic">{session.subject}</p>
                </div>
              </div>
            </div>

            {/* 2. Attendance Document */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Dokumen Presensi Murid
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    session.attendance_status === 'Attended'
                      ? 'bg-emerald-100 text-emerald-800'
                      : session.attendance_status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {session.attendance_status}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Waktu Check-In Murid
                  </span>
                  <span className="font-mono text-slate-800">
                    {session.check_in_time ? `${session.check_in_time} WIB` : 'Tidak ada check-in'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Catatan Perkembangan / Absensi
                  </span>
                  <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 italic mt-0.5">
                    "{session.student_notes || 'Tidak ada catatan khusus.'}"
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Verifikator Akademik
                  </span>
                  <span className="font-medium text-slate-800">
                    {session.verified_by || 'Academic Supervisor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Profile Card */}
          <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={session.instructor_avatar}
                alt={session.instructor_name}
                className="w-10 h-10 rounded-full border border-slate-300 object-cover bg-white"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {session.instructor_name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {session.department} • {session.instructor_email || 'instructor@academy.org'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Status Kepegawaian
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mt-0.5">
                {session.employment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
