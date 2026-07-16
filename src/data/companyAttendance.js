export const companyAttendanceSummary = {
  totalEmployees: 250,
  presentToday: 235,
  absent: 10,
  late: 5,
  averageRate: 96,
}

export const allEmployeeAttendance = [
  { name: 'Rajesh Singh', department: 'Backend', status: 'Present', checkIn: '09:02', checkOut: '18:45', attendance: 'On time' },
  { name: 'Aman Dev', department: 'Frontend', status: 'Late', checkIn: '09:24', checkOut: '18:52', attendance: 'Late arrival' },
  { name: 'Pradeep Kumar', department: 'HR', status: 'Present', checkIn: '08:58', checkOut: '18:40', attendance: 'On time' },
  { name: 'Neha Sharma', department: 'Finance', status: 'Absent', checkIn: '-', checkOut: '-', attendance: 'Day off' },
  { name: 'Radhika Mishra', department: 'Operations', status: 'Present', checkIn: '09:05', checkOut: '18:50', attendance: 'On time' },
  { name: 'Hemant Verma', department: 'Backend', status: 'Late', checkIn: '09:35', checkOut: '18:30', attendance: 'Late arrival' },
  { name: 'Priya Singh', department: 'Frontend', status: 'Present', checkIn: '09:00', checkOut: '18:45', attendance: 'On time' },
  { name: 'Arjun Patel', department: 'HR', status: 'Absent', checkIn: '-', checkOut: '-', attendance: 'Leave' },
]

export const companyAttendanceAlerts = [
  { id: '101', name: 'Aman Dev', department: 'Frontend', issue: 'Late', reliability: '98%' },
  { id: '102', name: 'Pradeep Kumar', department: 'HR', issue: 'Absent', reliability: '76%' },
  { id: '103', name: 'Radhika Mishra', department: 'Operations', issue: 'Missed Checkout', reliability: '80%' },
  { id: '104', name: 'Neha Sharma', department: 'Finance', issue: 'Late', reliability: '60%' },
  { id: '105', name: 'Hemant Verma', department: 'Backend', issue: 'Missing Checkout', reliability: '98%' },
  { id: '106', name: 'Arjun Patel', department: 'HR', issue: 'Absent', reliability: '72%' },
]