import React from 'react';
import {
  Filter,
  Calendar,
  User,
  GraduationCap,
  Briefcase,
  Activity,
  RotateCcw,
  Search,
} from 'lucide-react';
import { GRADES, EMPLOYMENT_STATUSES } from '../types/constants';
import { DATE_PRESETS } from '../utils/dateUtils';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  instructors = [],
}) {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const activeFilterCount = [
    filters.startDate || filters.endDate,
    filters.instructorId,
    filters.grade,
    filters.employmentStatus,
    filters.meetingStatus,
    filters.searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Top Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800">
            Filter & Klasifikasi Dashboard
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {activeFilterCount} filter aktif
            </span>
          )}
        </div>

        {/* Date Range Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Preset Periode:
          </span>
          {DATE_PRESETS.map((preset, idx) => {
            const isActive =
              filters.startDate === preset.start && filters.endDate === preset.end;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    startDate: preset.start,
                    endDate: preset.end,
                  });
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Date Range: Start Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Dari Tanggal
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Date Range: End Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Instructor Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            Instruktur
          </label>
          <select
            value={filters.instructorId || ''}
            onChange={(e) => handleInputChange('instructorId', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Instruktur ({instructors.length})</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.fullName} ({ins.employment_status})
              </option>
            ))}
          </select>
        </div>

        {/* Teaching Grade Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-400" />
            Teaching Grade
          </label>
          <select
            value={filters.grade || ''}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Grade (1 - 4)</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Status Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-slate-400" />
            Status Kepegawaian
          </label>
          <select
            value={filters.employmentStatus || ''}
            onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Status Pegawai</option>
            {EMPLOYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Status Pertemuan / Kategori Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Activity className="w-3 h-3 text-slate-400" />
            Status Pertemuan
          </label>
          <select
            value={filters.meetingStatus || ''}
            onChange={(e) => handleInputChange('meetingStatus', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Semua Pertemuan</option>
            <optgroup label="Validasi Payroll">
              <option value="eligible">Hanya Eligible Payroll (Submitted + Attended)</option>
              <option value="excluded">Hanya Excluded (Draft / Cancelled / Absent)</option>
            </optgroup>
            <optgroup label="Status Dokumen Jadwal">
              <option value="schedule_submitted">Jadwal: Submitted</option>
              <option value="schedule_draft">Jadwal: Draft</option>
              <option value="schedule_cancelled">Jadwal: Cancelled</option>
            </optgroup>
            <optgroup label="Status Presensi Murid">
              <option value="attendance_attended">Kehadiran: Attended</option>
              <option value="attendance_absent">Kehadiran: Absent</option>
              <option value="attendance_scheduled">Kehadiran: Scheduled</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Search & Reset Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari murid, mata pelajaran, kode jadwal..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Semua Filter
        </button>
      </div>
    </div>
  );
}
