import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BusinessFlowBanner from './components/BusinessFlowBanner';
import MetricCards from './components/MetricCards';
import FilterBar from './components/FilterBar';
import PayrollSummaryTable from './components/PayrollSummaryTable';
import TeachingReportsTable from './components/TeachingReportsTable';
import SessionDetailModal from './components/SessionDetailModal';
import { fetchInstructors } from './api/instructorApi';
import { SCHEDULE_DOCUMENTS, ATTENDANCE_DOCUMENTS } from './data/mockData';
import {
  joinTeachingSessions,
  calculatePayrollRecap,
} from './utils/payrollLogic';
import { isDateInRange } from './utils/dateUtils';
import { exportPayrollToExcel } from './utils/exportExcel';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [instructors, setInstructors] = useState([]);
  const [apiSource, setApiSource] = useState('api');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const initialFilters = {
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    instructorId: '',
    grade: '',
    employmentStatus: '',
    meetingStatus: '',
    searchQuery: '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'eligible' | 'excluded'
  const [selectedSession, setSelectedSession] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch instructors on mount
  useEffect(() => {
    async function loadInstructors() {
      setLoading(true);
      try {
        const result = await fetchInstructors();
        setInstructors(result.instructors);
        setApiSource(result.source);
        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInstructors();
  }, []);

  // Show transient toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Join raw datasets (Schedules + Attendances + Instructors)
  const allJoinedSessions = useMemo(() => {
    return joinTeachingSessions(
      SCHEDULE_DOCUMENTS,
      ATTENDANCE_DOCUMENTS,
      instructors
    );
  }, [instructors]);

  // 2. Apply filters to joined sessions
  const filteredSessions = useMemo(() => {
    return allJoinedSessions.filter((session) => {
      // Date Range Filter (Business Requirement: Dynamic based on Selected Date Range)
      if (!isDateInRange(session.date, filters.startDate, filters.endDate)) {
        return false;
      }

      // Instructor Name/ID Filter
      if (filters.instructorId && session.instructor_id !== Number(filters.instructorId)) {
        return false;
      }

      // Teaching Grade Filter
      if (filters.grade && session.teaching_grade !== filters.grade) {
        return false;
      }

      // Employment Status Filter
      if (filters.employmentStatus && session.employment_status !== filters.employmentStatus) {
        return false;
      }

      // Status Pertemuan Filter
      if (filters.meetingStatus) {
        if (filters.meetingStatus === 'eligible' && !session.is_payroll_eligible) {
          return false;
        }
        if (filters.meetingStatus === 'excluded' && session.is_payroll_eligible) {
          return false;
        }
        if (filters.meetingStatus === 'schedule_submitted' && session.schedule_status !== 'Submitted') {
          return false;
        }
        if (filters.meetingStatus === 'schedule_draft' && session.schedule_status !== 'Draft') {
          return false;
        }
        if (filters.meetingStatus === 'schedule_cancelled' && session.schedule_status !== 'Cancelled') {
          return false;
        }
        if (filters.meetingStatus === 'attendance_attended' && session.attendance_status !== 'Attended') {
          return false;
        }
        if (filters.meetingStatus === 'attendance_absent' && session.attendance_status !== 'Absent') {
          return false;
        }
        if (filters.meetingStatus === 'attendance_scheduled' && session.attendance_status !== 'Scheduled') {
          return false;
        }
      }

      // Free text search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchStudent = session.student_name.toLowerCase().includes(query);
        const matchSubject = session.subject.toLowerCase().includes(query);
        const matchCode = session.schedule_code.toLowerCase().includes(query);
        const matchInstructor = session.instructor_name.toLowerCase().includes(query);

        if (!matchStudent && !matchSubject && !matchCode && !matchInstructor) {
          return false;
        }
      }

      return true;
    });
  }, [allJoinedSessions, filters]);

  // 3. Compute Payroll Recapitulation
  // STRICT RULE: ONLY sessions with is_payroll_eligible are aggregated in payrollData!
  const payrollData = useMemo(() => {
    return calculatePayrollRecap(filteredSessions);
  }, [filteredSessions]);

  // KPI Calculations
  const totalSessionsCount = filteredSessions.length;
  const eligibleSessions = useMemo(() => {
    return filteredSessions.filter((s) => s.is_payroll_eligible);
  }, [filteredSessions]);
  const eligibleCount = eligibleSessions.length;
  const excludedCount = totalSessionsCount - eligibleCount;
  const activeInstructorsCount = payrollData.grandTotals.total_instructors;
  const estimatedTotalPayroll = payrollData.grandTotals.total_estimated_amount;

  // Handlers
  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      instructorId: '',
      grade: '',
      employmentStatus: '',
      meetingStatus: '',
      searchQuery: '',
    });
    setActiveTab('all');
    showToast('Semua filter berhasil direset.');
  };

  const handleSelectInstructor = (instructorId) => {
    setFilters((prev) => ({
      ...prev,
      instructorId: String(instructorId),
    }));
    showToast(`Memfilter laporan untuk Instruktur #${instructorId}`);
  };

  const handleExportExcel = () => {
    try {
      exportPayrollToExcel(payrollData, eligibleSessions, filters);
      showToast('File Excel Rekapitulasi Payroll berhasil diunduh!');
    } catch (err) {
      console.error('Failed to export Excel:', err);
      showToast('Gagal mengekspor file Excel.');
    }
  };

  const handleNavigateToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation & Status Bar */}
      <Header
        apiSource={apiSource}
        totalSessions={totalSessionsCount}
        eligibleCount={eligibleCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* Visual Business Flow & Strict Validation Principles */}
        <BusinessFlowBanner onNavigateToSection={handleNavigateToSection} />

        {/* KPI Metric Overview */}
        <MetricCards
          totalSessions={totalSessionsCount}
          eligibleCount={eligibleCount}
          excludedCount={excludedCount}
          activeInstructorsCount={activeInstructorsCount}
          estimatedTotalPayroll={estimatedTotalPayroll}
        />

        {/* Filter & Classification Controls */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          instructors={instructors}
        />

        {/* Section 1: Payroll Preparation Recapitulation (STRICT ONLY ELIGIBLE SESSIONS) */}
        <section className="space-y-3">
          <PayrollSummaryTable
            payrollData={payrollData}
            onExportExcel={handleExportExcel}
            onSelectInstructor={handleSelectInstructor}
            filterMeta={filters}
          />
        </section>

        {/* Section 2: Instructor Teaching Reports (All Sessions with full documents) */}
        <section className="space-y-3">
          <TeachingReportsTable
            sessions={filteredSessions}
            onSelectSession={setSelectedSession}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>
      </main>

      {/* Document Inspection Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">
            Instructor Manager Attendance & Payroll Preparation System
          </p>
          <p className="mt-1 text-slate-400">
            Built with React.js, Tailwind CSS, REST API DummyJSON, and SheetJS (xlsx). Front-end only architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}
