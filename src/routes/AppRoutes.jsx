import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import ForgotPasswordLayout from '../layouts/ForgotPasswordLayout.jsx'
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard.jsx'
import TeamLeaderDashboard from '../pages/dashboard/TeamLeaderDashboard.jsx'
import HRDashboard from '../pages/dashboard/HRDashboard.jsx'
import CEODashboard from '../pages/dashboard/CEODashboard.jsx'
import EmployeeModule from '../pages/employees/EmployeeModule.jsx'
import EmployeeProfile from '../pages/employees/EmployeeProfile.jsx'
import Attendance from '../pages/attendance/Attendance.jsx'
import TeamAttendance from '../pages/attendance/TeamAttendance.jsx'
import CEOAttendance from '../pages/attendance/CEOAttendance.jsx'
import WorkUpdate from '../pages/workupdate/WorkUpdate.jsx'
import Leave from '../pages/leave/Leave.jsx'
import Projects from '../pages/projects/Projects.jsx'
import ProjectDetails from '../pages/projects/ProjectDetails.jsx'
import Performance from '../pages/performance/Performance.jsx'
import Payroll from '../pages/payroll/Payroll.jsx'
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

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/forgot-password" element={<ForgotPasswordLayout />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/dashboard/team-leader" element={<TeamLeaderDashboard />} />
        <Route path="/dashboard/hr" element={<HRDashboard />} />
        <Route path="/dashboard/ceo" element={<CEODashboard />} />
        <Route path="/employees" element={<EmployeeModule />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/team" element={<TeamAttendance />} />
        <Route path="/attendance/company" element={<CEOAttendance />} />
        <Route path="/workupdate" element={<WorkUpdate />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/learning" element={<LearningDashboard />} />
        <Route path="/learning/my-learning" element={<MyLearning />} />
        <Route path="/learning/library" element={<TrainingLibrary />} />
        <Route path="/learning/ai-interviews" element={<AIInterview />} />
        <Route path="/learning/ai-interviews/report" element={<AIInterviewReport />} />
        <Route path="/learning/ai-interviews/session" element={<AIInterviewSession />} />
        <Route path="/learning/calendar" element={<LearningCalendar />} />
        <Route path="/learning/report" element={<Report />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
