import React from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Coins,
  TrendingUp,
} from 'lucide-react';

export default function MetricCards({
  totalSessions = 0,
  eligibleCount = 0,
  excludedCount = 0,
  activeInstructorsCount = 0,
  estimatedTotalPayroll = 0,
}) {
  const eligibleRate = totalSessions > 0
    ? Math.round((eligibleCount / totalSessions) * 100)
    : 0;

  const cards = [
    {
      title: 'Total Sesi Pertemuan',
      value: totalSessions,
      subtext: 'Berdasarkan filter aktif',
      icon: Calendar,
      color: 'blue',
      badge: `${totalSessions} Sesi`,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Disetujui Payroll (Valid)',
      value: eligibleCount,
      subtext: `${eligibleRate}% dari total pertemuan`,
      icon: CheckCircle,
      color: 'emerald',
      badge: 'Submitted & Attended',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Dikecualikan (Excluded)',
      value: excludedCount,
      subtext: 'Draft / Cancelled / Absent',
      icon: XCircle,
      color: 'rose',
      badge: 'Tidak Dihitung',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Instruktur Aktif',
      value: activeInstructorsCount,
      subtext: 'Memiliki sesi valid',
      icon: Users,
      color: 'indigo',
      badge: 'Siap Diajukan',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Estimasi Payroll',
      value: `Rp ${estimatedTotalPayroll.toLocaleString('id-ID')}`,
      subtext: 'Acuan persiapan Finance',
      icon: Coins,
      color: 'amber',
      badge: 'Simulasi Rate',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  const colorStyles = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600',
      border: 'hover:border-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'hover:border-emerald-300',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-600',
      border: 'hover:border-rose-300',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600',
      border: 'hover:border-indigo-300',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'hover:border-amber-300',
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const style = colorStyles[card.color];

        return (
          <div
            key={idx}
            className={`bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 shadow-sm ${style.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.text} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[130px]">{card.subtext}</span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
