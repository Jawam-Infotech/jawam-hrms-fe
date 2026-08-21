const permissions = {
  CEO: {
  leave: {
    canApply: false,
    canReview: true,
  },
  attendance: {
    canReviewCorrectionRequests: true,
  },
  employee: {
    canViewList: true,
    canViewProfile: true,
    canEditProfile: true,
    canDeleteEmployee: true,
    canCreateEmployee: true,

    canViewEmploymentDetails: true,
    canViewDocuments: true,
    canViewAssets: true,
    canAssignTask: true,
    canViewWorkUpdates: true,
  },
},
  HR: {
  leave: {
    canApply: true,
    canReview: true,
  },
  attendance: {
    canReviewCorrectionRequests: true,
  },
  employee: {
    canViewList: true,
    canViewProfile: true,
    canEditProfile: true,
    canDeleteEmployee: false,
    canCreateEmployee: true,

    canViewEmploymentDetails: true,
    canViewDocuments: true,
    canViewAssets: true,
    canAssignTask: false,
    canViewWorkUpdates: false,
  },
},
TEAM_LEAD: {
  leave: {
    canApply: true,
    canReview: true,
  },
  attendance: {
    canReviewCorrectionRequests: false,
  },
  employee: {
    canViewList: true,
    canViewProfile: true,
    canEditProfile: false,
    canDeleteEmployee: false,
    canCreateEmployee: false,

    canViewEmploymentDetails: false,
    canViewDocuments: false,
    canViewAssets: false,
    canAssignTask: true,
    canViewWorkUpdates: true,
  },
},
  EMPLOYEE: {
  leave: {
    canApply: true,
    canReview: false,
  },
  attendance: {
    canReviewCorrectionRequests: false,
  },
  employee: {
    canViewList: true,
    canViewProfile: false,
    canEditProfile: false,
    canDeleteEmployee: false,
    canCreateEmployee: false,

    canViewEmploymentDetails: false,
    canViewDocuments: false,
    canViewAssets: false,
    canAssignTask: false,
    canViewWorkUpdates: false,
  },
},
}

export default permissions
