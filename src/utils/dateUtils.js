/**
 * Date utility helpers for filtering and formatting
 */

/**
 * Format a YYYY-MM-DD date string to a human-readable Indonesian locale format
 * Example: '2026-10-15' -> '15 Okt 2026'
 */
export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [year, month, day] = parts;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const mIndex = parseInt(month, 10) - 1;
  const mName = monthNames[mIndex] || month;

  return `${parseInt(day, 10)} ${mName} ${year}`;
}

/**
 * Check if a given date string (YYYY-MM-DD) falls within [startDate, endDate] inclusive
 */
export function isDateInRange(dateStr, startDate, endDate) {
  if (!dateStr) return false;
  if (!startDate && !endDate) return true;

  if (startDate && dateStr < startDate) {
    return false;
  }
  if (endDate && dateStr > endDate) {
    return false;
  }
  return true;
}

/**
 * Predefined Date Range Presets
 * Note: Our dataset focuses around October 2026
 */
export const DATE_PRESETS = [
  { label: 'Semua Periode', start: '', end: '' },
  { label: 'Bulan Ini (Okt 2026)', start: '2026-10-01', end: '2026-10-31' },
  { label: 'Bulan Lalu (Sep 2026)', start: '2026-09-01', end: '2026-09-30' },
  { label: 'Minggu Ini (25 - 31 Okt)', start: '2026-10-25', end: '2026-10-31' },
  { label: 'Dua Pekan Terakhir', start: '2026-10-15', end: '2026-10-31' },
];
