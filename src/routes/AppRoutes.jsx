import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import ForgotPasswordLayout from '../layouts/ForgotPasswordLayout.jsx'
import NotFound from '../pages/NotFound.jsx'
// import AuthLayout from '../layouts/AuthLayout.jsx'
// import Login from '../pages/auth/Login.jsx'
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
import WorkUpdate from '../pages/workupdate/WorkUpdate.jsx'
import Recruitment from '../pages/recruitment/Recruitment.jsx'
import Leave from '../pages/leave/Leave.jsx'
import Projects from '../pages/projects/Projects.jsx'
import ProjectDetails from '../pages/projects/ProjectDetails.jsx'
import Performance from '../pages/performance/Performance.jsx'
import Payroll from '../pages/payroll/Payroll.jsx'
import Expenses from '../pages/expenses/Expenses.jsx'
import Assets from '../pages/assets/Assets.jsx'
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

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public routes — no login required */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordLayout />} />
        {/* <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Role-locked dashboards — each role only sees its own */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team-leader"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <TeamLeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hr"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ceo"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared pages — any logged-in role can access */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeModule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
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
            <ProtectedRoute allowedRoles={['manager']}>
              <TeamAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/company"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CEOAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workupdate"
          element={
            <ProtectedRoute>
              <WorkUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <Recruitment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <Leave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timesheet"
          element={
            <ProtectedRoute>
              <Timesheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />
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

        {/* Learning & Training (jlearn) — shared across roles */}
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
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <Invoice />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all — unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
