import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPeople, cilBell, cilSoccer, cilMobile, cilPuzzle, cilPenNib, cibGreenkeeper, cibMagento, cilReportSlash } from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    dbname: 'dashboard',
    to: '/pages',
    icon: <CIcon icon={cibGreenkeeper} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Employee',
    dbname: 'employee',
    to: '/pages/employee',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'HR',
    dbname: 'hr',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Branch',
        to: '/pages/branch',
      },
      {
        component: CNavItem,
        name: 'Department',
        to: '/pages/department',
      },
      {
        component: CNavItem,
        name: 'Designation',
        to: '/pages/designation',
      },
      {
        component: CNavItem,
        name: 'Award Type',
        to: '/pages/awardType',
      },
      {
        component: CNavItem,
        name: 'Leave Type',
        to: '/pages/leaveType',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Staff',
    dbname: 'staff',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/pages/branch',
      },
      {
        component: CNavItem,
        name: 'Employee Profile',
        to: '/pages/employeeProfile',
      },
    ],

  },
  {
    component: CNavGroup,
    name: 'Timesheet',
    dbname: 'timesheet',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Timesheet',
        to: '/pages/timesheet',
      },
      {
        component: CNavItem,
        name: 'Manage Leave',
        to: '/pages/leave',
      },

      {
        component: CNavItem,
        name: 'Marked Attendance',
        to: '/pages/markedAttendance',
      },
      {
        component: CNavItem,
        name: 'Bulk Attendance',
        to: '/pages/bulkAttendance',
      },
    ],

  },
  {
    component: CNavItem,
    name: 'Meeting',
    dbname: 'meeting',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/pages/meeting',
  },
  {
    component: CNavItem,
    name: 'Awards',
    dbname: 'awards',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/pages/awards',
  },
  {
    component: CNavItem,
    name: 'Company Policy',
    dbname: 'companyPolicy',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/pages/companyPolicy',
  },

]
export default _nav
