import React from 'react';
import { CalendarCheck, Database, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Header({ apiSource, totalSessions, eligibleCount }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Instructor Manager Attendance & Payroll Dashboard
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Role: Instructor Manager
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alur Bisnis: Laporan Mengajar → Validasi & Klasifikasi → Payroll Preparation → Export Excel Finance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* API Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium bg-slate-50 border-slate-200 text-slate-700">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Data API:</span>
              {apiSource === 'api' ? (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  DummyJSON Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Local Dataset
                </span>
              )}
            </div>

            {/* Business Rule Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rule Payroll: Submitted & Attended</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
