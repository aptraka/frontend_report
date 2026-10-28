import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Info,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { GRADES, DEFAULT_GRADE_RATES } from '../types/constants';

export default function PayrollSummaryTable({
  payrollData,
  onExportExcel,
  onSelectInstructor,
  filterMeta,
}) {
  const { recapRows = [], grandTotals = {} } = payrollData;
  const [showRateSettings, setShowRateSettings] = useState(false);
  const [rates, setRates] = useState(DEFAULT_GRADE_RATES);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      onExportExcel();
      setIsExporting(false);
    }, 400);
  };

  const getEmploymentBadge = (status) => {
    switch (status) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Part-time':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Freelance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Payroll Preparation: Rekapitulasi Sesi Disetujui
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hanya merangkum pertemuan yang lolos verifikasi (Schedule: <span className="font-semibold text-emerald-700">Submitted</span> & Kehadiran: <span className="font-semibold text-emerald-700">Attended</span>)
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rate Simulation Toggle */}
          <button
            type="button"
            onClick={() => setShowRateSettings(!showRateSettings)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulasi Rate Honor</span>
            {showRateSettings ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Export Excel Button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={recapRows.length === 0 || isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExporting ? 'Memproses Ekspor...' : 'Export Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Rate Customizer Drawer */}
      {showRateSettings && (
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Sesuaikan Tarif Standar Per Sesi untuk Simulasi Tim Finance (IDR):
            </span>
            <button
              onClick={() => setRates(DEFAULT_GRADE_RATES)}
              className="text-[11px] text-emerald-700 underline hover:text-emerald-900"
            >
              Reset ke Default
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GRADES.map((grade) => (
              <div key={grade} className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Tarif {grade}
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="5000"
                    value={rates[grade] || 0}
                    onChange={(e) =>
                      setRates({
                        ...rates,
                        [grade]: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full text-xs pl-7 pr-2 py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strict Rule Notice Box */}
      <div className="mx-4 sm:mx-5 my-3 p-3 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Aturan Bisnis Payroll (Strict Rule):</p>
          <p className="text-blue-800/90 mt-0.5">
            Sesi berstatus jadwal <strong>Draft</strong> atau <strong>Cancelled</strong>, serta status kehadiran murid <strong>Scheduled</strong> (belum terlaksana) atau <strong>Absent</strong> (absen) <span className="underline font-medium">secara mutlak di-skip/exclude</span> dari tabel ini. File Excel yang diekspor telah dilengkapi sheet Rekapitulasi dan sheet Audit Log Sesi Valid.
          </p>
        </div>
      </div>

      {/* Recap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-y border-slate-200">
            <tr>
              <th className="py-3 px-3.5 text-center w-12">No</th>
              <th className="py-3 px-4">Nama Instruktur</th>
              <th className="py-3 px-4">Status Pegawai</th>
              <th className="py-3 px-3 text-center bg-blue-50/50">Grade 1</th>
              <th className="py-3 px-3 text-center bg-blue-50/50">Grade 2</th>
              <th className="py-3 px-3 text-center bg-blue-50/50">Grade 3</th>
              <th className="py-3 px-3 text-center bg-blue-50/50">Grade 4</th>
              <th className="py-3 px-4 text-center font-bold text-emerald-800 bg-emerald-50/60">
                Total Sesi Disetujui
              </th>
              <th className="py-3 px-4 text-right">Estimasi Honor (Rp)</th>
              <th className="py-3 px-3 text-center">Aksi Filter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {recapRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm font-semibold text-slate-600">
                      Tidak ada data sesi yang memenuhi syarat payroll
                    </p>
                    <p className="text-xs text-slate-400">
                      Coba sesuaikan filter tanggal atau pilih periode yang lebih luas.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recapRows.map((row, idx) => {
                // Dynamically recompute estimate based on active custom rates
                let rowEstimate = 0;
                GRADES.forEach((g) => {
                  rowEstimate += (row.grade_breakdown[g] || 0) * (rates[g] || DEFAULT_GRADE_RATES[g] || 0);
                });

                return (
                  <tr
                    key={row.instructor_id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.instructor_avatar}
                          alt={row.instructor_name}
                          className="w-7 h-7 rounded-full bg-slate-100 object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">
                            {row.instructor_name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            ID #{row.instructor_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getEmploymentBadge(
                          row.employment_status
                        )}`}
                      >
                        {row.employment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 bg-blue-50/30">
                      {row.grade_breakdown['Grade 1'] || 0}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 bg-blue-50/30">
                      {row.grade_breakdown['Grade 2'] || 0}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 bg-blue-50/30">
                      {row.grade_breakdown['Grade 3'] || 0}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 bg-blue-50/30">
                      {row.grade_breakdown['Grade 4'] || 0}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40 text-sm">
                      {row.total_eligible_sessions}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      Rp {rowEstimate.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectInstructor(row.instructor_id)}
                        className="px-2 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Filter sesi instruktur ini di tabel laporan"
                      >
                        Lihat Sesi
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Grand Totals Footer */}
          {recapRows.length > 0 && (
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3.5 px-3.5 text-center">#</td>
                <td className="py-3.5 px-4 uppercase text-[11px] tracking-wider text-slate-700">
                  Total Keseluruhan
                </td>
                <td className="py-3.5 px-4 text-xs font-normal text-slate-500">
                  {grandTotals.total_instructors || recapRows.length} Instruktur
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-sm bg-blue-100/50 text-blue-900">
                  {grandTotals['Grade 1'] || 0}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-sm bg-blue-100/50 text-blue-900">
                  {grandTotals['Grade 2'] || 0}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-sm bg-blue-100/50 text-blue-900">
                  {grandTotals['Grade 3'] || 0}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-sm bg-blue-100/50 text-blue-900">
                  {grandTotals['Grade 4'] || 0}
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-base font-extrabold text-emerald-800 bg-emerald-100/60">
                  {grandTotals.total_eligible_sessions || 0}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-sm font-extrabold text-slate-900">
                  Rp{' '}
                  {recapRows
                    .reduce((acc, row) => {
                      let rowEst = 0;
                      GRADES.forEach((g) => {
                        rowEst += (row.grade_breakdown[g] || 0) * (rates[g] || DEFAULT_GRADE_RATES[g] || 0);
                      });
                      return acc + rowEst;
                    }, 0)
                    .toLocaleString('id-ID')}
                </td>
                <td className="py-3.5 px-3 text-center text-xs text-slate-400 font-normal">
                  Valid
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
