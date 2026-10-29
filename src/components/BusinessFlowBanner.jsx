import React from 'react';
import {
  FileText,
  Filter,
  Calculator,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function BusinessFlowBanner({ onNavigateToSection }) {
  const steps = [
    {
      num: '01',
      title: 'Laporan Pertemuan Instruktur',
      desc: 'Laporan murid yang diisi & dibuat oleh para instruktur',
      icon: FileText,
      color: 'blue',
      sectionId: 'teaching-reports-section',
    },
    {
      num: '02',
      title: 'Validasi & Klasifikasi',
      desc: 'Filter & audit: Periode, Instruktur, Grade, Status Pegawai, Status Pertemuan',
      icon: Filter,
      color: 'amber',
      sectionId: 'filter-section',
    },
    {
      num: '03',
      title: 'Payroll Preparation',
      desc: 'Rekapitulasi HANYA pertemuan yang memenuhi syarat payroll',
      icon: Calculator,
      color: 'emerald',
      sectionId: 'payroll-prep-section',
    },
    {
      num: '04',
      title: 'Export Excel untuk Finance',
      desc: 'Jumlah pertemuan per kategori, siap diisi tarif per pertemuan oleh Finance',
      icon: FileSpreadsheet,
      color: 'indigo',
      sectionId: 'payroll-prep-section',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Visual Workflow Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Alur Bisnis: Instructor Manager Attendance & Payroll Preparation
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Role: Instructor Manager
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateToSection && onNavigateToSection(step.sectionId)}
                className="group relative bg-slate-50 hover:bg-slate-100/80 transition-all rounded-xl p-3 border border-slate-200/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    STEP {step.num}
                  </span>
                  <div className="p-1 rounded-lg bg-white shadow-xs text-slate-700 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {step.desc}
                </p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strict Manager Validation Principle Alert */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50/50 border border-amber-200/80 text-amber-950 flex items-start gap-3 shadow-xs">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed space-y-1">
          <p className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>Prinsip Validasi Instructor Manager:</span>
            <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-amber-200/70 text-amber-800">
              Sangat Penting
            </span>
          </p>
          <p className="text-amber-900/90">
            <strong>Laporan mengajar bukan otomatis pertemuan yang dibayar.</strong> Sesi dengan status murid absen (<strong>Absent</strong>), kelas yang dibatalkan (<strong>Cancelled</strong>), dokumen masih berupa rancangan (<strong>Draft</strong>), atau laporan yang terindikasi <strong>Duplikat</strong> <span className="underline font-semibold">tidak boleh otomatis dihitung</span> sebagai pertemuan yang dibayar tanpa memenuhi aturan bisnis validasi: <strong>Schedule Status = Submitted</strong> DAN <strong>Attendance Status = Attended</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
