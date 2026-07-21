const permissions = {
  CEO: {
    employee: {
      canViewList: true,
      canViewProfile: true,
      canEditProfile: true,
      canDeleteEmployee: true,
      canCreateEmployee: true,
    },
  },
  HR: {
    employee: {
      canViewList: true,
      canViewProfile: true,
      canEditProfile: true,
      canDeleteEmployee: false,
      canCreateEmployee: true,
    },
  },
  TEAM_LEAD: {
    employee: {
      canViewList: true,
      canViewProfile: true,
      canEditProfile: false,
      canDeleteEmployee: false,
      canCreateEmployee: false,
    },
  },
  EMPLOYEE: {
    employee: {
      canViewList: true,
      canViewProfile: false,
      canEditProfile: false,
      canDeleteEmployee: false,
      canCreateEmployee: false,
    },
  },
}

export default permissions
