const permissions = {
  CEO: {
    leave: {
      canApply: false,
      canReview: true,
      canReviewCancellation: true,
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
      canReviewCancellation: true,
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

      // TL can review normal leave requests.
      canReview: true,

      // TL cannot approve/reject cancellation requests.
      canReviewCancellation: false,
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
      canReviewCancellation: false,
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