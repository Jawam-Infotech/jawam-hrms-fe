import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import PageLoader from '../components/ui/PageLoader.jsx'

import LoginPage from '../pages/auth/LoginPage.jsx'
import ForgotPasswordLayout from '../layouts/ForgotPasswordLayout.jsx'
import NotFound from '../pages/NotFound.jsx'

const EmployeeDashboard = lazy(() => import('../pages/dashboard/EmployeeDashboard.jsx'))
const TeamLeaderDashboard = lazy(() => import('../pages/dashboard/TeamLeaderDashboard.jsx'))
const HRDashboard = lazy(() => import('../pages/dashboard/HRDashboard.jsx'))
const CEODashboard = lazy(() => import('../pages/dashboard/CEODashboard.jsx'))

const EmployeeModule = lazy(() => import('../pages/employees/EmployeeModule.jsx'))
const EmployeeProfile = lazy(() => import('../pages/employees/EmployeeProfile.jsx'))
const EmployeeOnboarding = lazy(() => import('../pages/employees/EmployeeOnboarding.jsx'))

const Clients = lazy(() => import('../pages/clients/Clients.jsx'))

const Attendance = lazy(() => import('../pages/attendance/Attendance.jsx'))
const TeamAttendance = lazy(() => import('../pages/attendance/TeamAttendance.jsx'))
const CEOAttendance = lazy(() => import('../pages/attendance/CEOAttendance.jsx'))
const HolidayManagement = lazy(() => import('../pages/attendance/HolidayManagement.jsx'))
const CorrectionRequests = lazy(() => import('../pages/attendance/CorrectionRequests.jsx'))

const WorkUpdate = lazy(() => import('../pages/workupdate/WorkUpdate.jsx'))
const Recruitment = lazy(() => import('../pages/recruitment/Recruitment.jsx'))

const LeaveEntry = lazy(() => import('../pages/leave/LeaveEntry.jsx'))
const LeaveReview = lazy(() => import('../pages/leave/LeaveReview.jsx'))

const Projects = lazy(() => import('../pages/projects/Projects.jsx'))
const ProjectDetails = lazy(() => import('../pages/projects/ProjectDetails.jsx'))

const Performance = lazy(() => import('../pages/performance/Performance.jsx'))
const Payroll = lazy(() => import('../pages/payroll/Payroll.jsx'))
const PayrollDetail = lazy(() => import('../pages/payroll/PayrollDetail.jsx'))
const FinalSettlementDetail = lazy(() => import('../pages/payroll/FinalSettlementDetail.jsx'))
const Expenses = lazy(() => import('../pages/expenses/Expenses.jsx'))
const Assets = lazy(() => import('../pages/assets/Assets.jsx'))
const AssetManagement = lazy(() => import('../pages/assets/AssetManagement.jsx'))
const AssetTypeDetails = lazy(() => import('../pages/assets/AssetTypeDetails.jsx'))
const Timesheet = lazy(() => import('../pages/timesheet/Timesheet.jsx'))

const LearningDashboard = lazy(() => import('../pages/jlearn/dashboard/LearningDashboard.jsx'))
const MyLearning = lazy(() => import('../pages/jlearn/my-learning/MyLearning.jsx'))
const TrainingLibrary = lazy(() => import('../pages/jlearn/training/TrainingLibrary.jsx'))
const AIInterview = lazy(() => import('../pages/jlearn/ai_interview/AIInterview.jsx'))
const AIInterviewReport = lazy(() => import('../pages/jlearn/ai_interview/AIInterviewReport.jsx'))
const AIInterviewSession = lazy(() => import('../pages/jlearn/ai_interview/AIInterviewSession.jsx'))
const LearningCalendar = lazy(() => import('../pages/jlearn/calendar/LearningCalendar.jsx'))
const Report = lazy(() => import('../pages/jlearn/report/Report.jsx'))

const Reports = lazy(() => import('../pages/reports/Reports.jsx'))
const Invoice = lazy(() => import('../pages/invoice/Invoice.jsx'))

const MyProfile = lazy(() => import('../pages/profile/MyProfile.jsx'))
const EditProfile = lazy(() => import('../pages/profile/EditProfile.jsx'))

const Settings = lazy(() => import('../pages/settings/Settings.jsx'))
const Helpdesk = lazy(() => import('../pages/helpdesk/Helpdesk.jsx'))

function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>

        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordLayout />}
        />


        {/* ==================== DASHBOARDS ==================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/team-leader"
          element={
            <ProtectedRoute allowedRoles={['TL']}>
              <TeamLeaderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/hr"
          element={
            <ProtectedRoute allowedRoles={['HR']}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ceo"
          element={
            <ProtectedRoute allowedRoles={['CEO']}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />


        {/* ==================== EMPLOYEES ==================== */}

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeModule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/new"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <EmployeeOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <EmployeeOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />


        {/* ==================== PROFILE ==================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />


        {/* ==================== CLIENTS ==================== */}

        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Clients />
            </ProtectedRoute>
          }
        />


        {/* ==================== ATTENDANCE ==================== */}

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/team"
          element={
            <ProtectedRoute allowedRoles={['TL']}>
              <TeamAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/company"
          element={
            <ProtectedRoute allowedRoles={['CEO', 'HR']}>
              <CEOAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/holidays"
          element={
            <ProtectedRoute allowedRoles={['CEO', 'HR']}>
              <HolidayManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/correction-requests"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'TL', 'HR']}>
              <CorrectionRequests />
            </ProtectedRoute>
          }
        />


        {/* ==================== WORK UPDATE ==================== */}

        <Route
          path="/workupdate"
          element={
            <ProtectedRoute allowedRoles={['HR']}>
              <WorkUpdate />
            </ProtectedRoute>
          }
        />


        {/* ==================== RECRUITMENT ==================== */}

        <Route
          path="/recruitment"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Recruitment />
            </ProtectedRoute>
          }
        />


        {/* ==================== LEAVE ==================== */}

        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LeaveEntry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave/review"
          element={
            <ProtectedRoute requiredPermission="leave.canReview">
              <LeaveReview />
            </ProtectedRoute>
          }
        />


        {/* ==================== PERFORMANCE ==================== */}

        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          }
        />


        {/* ==================== EXPENSES ==================== */}

        <Route
          path="/expenses"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Expenses />
            </ProtectedRoute>
          }
        />


        {/* ==================== PAYROLL ==================== */}

        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll/settings"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Payroll />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll/reports"
          element={<ProtectedRoute allowedRoles={['HR', 'CEO']}><Payroll /></ProtectedRoute>}
        />

        <Route
          path="/payroll/settlements/:id"
          element={
            <ProtectedRoute>
              <FinalSettlementDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll/:id"
          element={
            <ProtectedRoute>
              <PayrollDetail />
            </ProtectedRoute>
          }
        />

        <Route
  path="/payroll/salary-revisions"
  element={
    <ProtectedRoute allowedRoles={['HR', 'CEO']}>
      <Payroll />
    </ProtectedRoute>
  }
/>


        {/* ==================== TIMESHEET ==================== */}

        <Route
          path="/timesheet"
          element={
            <ProtectedRoute>
              <Timesheet />
            </ProtectedRoute>
          }
        />


        {/* ==================== ASSETS ==================== */}

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />

        <Route
  path="/assets/manage"
  element={
    <ProtectedRoute allowedRoles={['HR', 'CEO']}>
      <AssetManagement />
    </ProtectedRoute>
  }
/>


<Route
  path="/assets/manage/type/:assetTypeId"
  element={
    <ProtectedRoute allowedRoles={['HR', 'CEO']}>
      <AssetTypeDetails />
    </ProtectedRoute>
  }
/>


        {/* ==================== PROJECTS ==================== */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />


        {/* ==================== LEARNING ==================== */}

        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/my-learning"
          element={
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/library"
          element={
            <ProtectedRoute>
              <TrainingLibrary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/ai-interviews"
          element={
            <ProtectedRoute>
              <AIInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/ai-interviews/report"
          element={
            <ProtectedRoute>
              <AIInterviewReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/ai-interviews/session"
          element={
            <ProtectedRoute>
              <AIInterviewSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/calendar"
          element={
            <ProtectedRoute>
              <LearningCalendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />


        {/* ==================== REPORTS ==================== */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* ==================== INVOICE ==================== */}

        <Route
          path="/invoice"
          element={
            <ProtectedRoute allowedRoles={['HR', 'CEO']}>
              <Invoice />
            </ProtectedRoute>
          }
        />


        {/* ==================== SETTINGS ==================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        <Route
  path="/helpdesk"
  element={
    <ProtectedRoute>
      <Helpdesk />
    </ProtectedRoute>
  }
/>


        {/* ==================== DEFAULT ROUTES ==================== */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
      </Suspense>
    </Router>
  )
}

export default AppRoutes
