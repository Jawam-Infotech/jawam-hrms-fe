import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'

import LoginPage from '../pages/auth/LoginPage.jsx'
import ForgotPasswordLayout from '../layouts/ForgotPasswordLayout.jsx'
import NotFound from '../pages/NotFound.jsx'

import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard.jsx'
import TeamLeaderDashboard from '../pages/dashboard/TeamLeaderDashboard.jsx'
import HRDashboard from '../pages/dashboard/HRDashboard.jsx'
import CEODashboard from '../pages/dashboard/CEODashboard.jsx'

import EmployeeModule from '../pages/employees/EmployeeModule.jsx'
import EmployeeProfile from '../pages/employees/EmployeeProfile.jsx'
import EmployeeOnboarding from '../pages/employees/EmployeeOnboarding.jsx'

import Clients from '../pages/clients/Clients.jsx'

import Attendance from '../pages/attendance/Attendance.jsx'
import TeamAttendance from '../pages/attendance/TeamAttendance.jsx'
import CEOAttendance from '../pages/attendance/CEOAttendance.jsx'
import HolidayManagement from '../pages/attendance/HolidayManagement.jsx'
import CorrectionRequests from '../pages/attendance/CorrectionRequests.jsx'

import WorkUpdate from '../pages/workupdate/WorkUpdate.jsx'
import Recruitment from '../pages/recruitment/Recruitment.jsx'

import LeaveEntry from '../pages/leave/LeaveEntry.jsx'
import LeaveReview from '../pages/leave/LeaveReview.jsx'

import Projects from '../pages/projects/Projects.jsx'
import ProjectDetails from '../pages/projects/ProjectDetails.jsx'

import Performance from '../pages/performance/Performance.jsx'
import Payroll from '../pages/payroll/Payroll.jsx'
import Expenses from '../pages/expenses/Expenses.jsx'
import Assets from '../pages/assets/Assets.jsx'
import AssetManagement from '../pages/assets/AssetManagement.jsx'
import AssetTypeDetails from '../pages/assets/AssetTypeDetails.jsx'
import Timesheet from '../pages/timesheet/Timesheet.jsx'

import LearningDashboard from '../pages/jlearn/dashboard/LearningDashboard.jsx'
import MyLearning from '../pages/jlearn/my-learning/MyLearning.jsx'
import TrainingLibrary from '../pages/jlearn/training/TrainingLibrary.jsx'
import AIInterview from '../pages/jlearn/ai_interview/AIInterview.jsx'
import AIInterviewReport from '../pages/jlearn/ai_interview/AIInterviewReport.jsx'
import AIInterviewSession from '../pages/jlearn/ai_interview/AIInterviewSession.jsx'
import LearningCalendar from '../pages/jlearn/calendar/LearningCalendar.jsx'
import Report from '../pages/jlearn/report/Report.jsx'

import Reports from '../pages/reports/Reports.jsx'
import Invoice from '../pages/invoice/Invoice.jsx'

import MyProfile from '../pages/profile/MyProfile.jsx'
import EditProfile from '../pages/profile/EditProfile.jsx'

import Settings from '../pages/settings/Settings.jsx'
import Helpdesk from '../pages/helpdesk/Helpdesk.jsx'

function AppRoutes() {
  return (
    <Router>
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
            <ProtectedRoute>
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
    </Router>
  )
}

export default AppRoutes
