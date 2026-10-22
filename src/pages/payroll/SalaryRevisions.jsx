import { useContext, useEffect, useState } from 'react'
import usePayroll from '../../hooks/usePayroll.js'
import CreateSalaryRevisionModal from '../../components/payroll/CreateSalaryRevisionModal.jsx'
import SalaryRevisionDetailModal from '../../components/payroll/SalaryRevisionDetailModal.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { UserContext } from '../../context/UserContext.jsx'
import AssetRequestsPagination from '../../components/assets/AssetRequestsPagination.jsx'

function SalaryRevisions() {
  const { user } = useContext(UserContext)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)
  const [detailModalKey, setDetailModalKey] = useState(0)

  const canCreateSalaryRevision = user.role === 'HR'
  const canReviewSalaryRevision = user.role === 'CEO'

  const {
    revisions,
    revisionPagination,
    revisionsLoading,
    revisionsError,
    fetchRevisions,
    fetchRevisionById,
    revision,
    revisionDetailLoading,
    revisionDetailError,
    handleCreateRevision,
    handleApproveRevision,
    handleRejectRevision,
    revisionActionLoading,
    revisionActionError,
    clearRevisionActionError,
  } = usePayroll()

  const currentPage = revisionPagination?.page || 1
  const totalPages = Math.max(
    1,
    Math.ceil((revisionPagination?.count || 0) / 10),
  )

  useEffect(() => {
    fetchRevisions({ page: 1 })
  }, [fetchRevisions])

  const getErrorMessage = (error) => {
    return getApiErrorMessage(error, 'Unable to load salary revisions.')
  }

  const getStatusClass = (status) => {
    if (status === 'APPROVED') return 'bg-[#dcfce7] text-[#16a34a]'
    if (status === 'REJECTED') return 'bg-[#fee2e2] text-[#dc2626]'
    if (status === 'CANCELLED') return 'bg-[#e5e7eb] text-[#4b5563]'
    return 'bg-[#fef3c7] text-[#d97706]'
  }

  const handleCreate = async (payload) => {
    try {
      await handleCreateRevision(payload)

      await fetchRevisions({ page: currentPage })

      setIsCreateModalOpen(false)
    } catch {
      // The hook stores the API error in revisionActionError.
      // Keep the modal open so the user can correct the request.
    }
  }

  const handleRevisionPageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      revisionsLoading
    ) {
      return
    }

    fetchRevisions({ page }).catch(() => {})
  }

  const handleViewRevision = async (revisionId) => {
    clearRevisionActionError()
    setDetailModalKey((current) => current + 1)
    setIsDetailOpen(true)

    await fetchRevisionById(revisionId)
  }

  const handleApprove = async (revisionId) => {
    try {
      await handleApproveRevision(revisionId)

      await Promise.all([
        fetchRevisions({ page: currentPage }),
        fetchRevisionById(revisionId),
      ])
    } catch {
      // The hook stores the API error in revisionActionError.
    }
  }

  const handleReject = async (revisionId, reason) => {
    try {
      await handleRejectRevision(revisionId, reason)

      await Promise.all([
        fetchRevisions({ page: currentPage }),
        fetchRevisionById(revisionId),
      ])
    } catch {
      // The hook stores the API error in revisionActionError.
    }
  }

  const handleCloseCreateModal = () => {
    if (!revisionActionLoading) {
      clearRevisionActionError()
      setIsCreateModalOpen(false)
    }
  }

  const handleCloseDetailModal = () => {
    if (!revisionActionLoading) {
      clearRevisionActionError()
      setIsDetailOpen(false)
    }
  }

  return (
    <>
      <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#111827]">
            Salary Revisions
          </h2>

          {canCreateSalaryRevision && (
            <button
              type="button"
              onClick={() => {
                clearRevisionActionError()
                setCreateModalKey((current) => current + 1)
                setIsCreateModalOpen(true)
              }}
              className="rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1f2937]"
            >
              Create Revision
            </button>
          )}
        </div>

        {/* Loading */}
        {revisionsLoading && (
          <div className="py-12 text-center">
            <p className="text-[14px] text-[#6b7280]">
              Loading salary revisions...
            </p>
          </div>
        )}

        {/* Error */}
        {!revisionsLoading && revisionsError && (
          <div className="rounded-[16px] border border-[#fecaca] bg-[#fef2f2] p-6 text-center">
            <p className="text-[14px] font-semibold text-[#b91c1c]">
              {getErrorMessage(revisionsError)}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!revisionsLoading &&
          !revisionsError &&
          revisions.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="text-[16px] font-bold text-[#111827]">
                No salary revisions found
              </h3>

              <p className="mt-2 text-[14px] text-[#6b7280]">
                Salary revision requests will appear here once they are
                available.
              </p>
            </div>
          )}

        {/* Revision List */}
        {!revisionsLoading &&
          !revisionsError &&
          revisions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[14px] text-[#374151]">
                <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <tr>
                    <th className="py-4 font-semibold">
                      Employee
                    </th>

                    <th className="py-4 font-semibold">
                      New Salary
                    </th>

                    <th className="py-4 font-semibold">
                      Annual CTC
                    </th>

                    <th className="py-4 font-semibold">
                      Effective Date
                    </th>

                    <th className="py-4 font-semibold">
                      Status
                    </th>

                    <th className="py-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {revisions.map((revision, index) => (
                    <tr
                      key={revision.id ? revision.id : `revision-${index}`}
                      className="border-b border-[#f3f4f6] transition-all hover:bg-[#f8fafc]"
                    >
                      <td className="py-4 font-semibold text-[#111827]">
                        {revision.employee_name || '-'}
                      </td>

                      <td className="py-4">
                        {revision.monthly_salary ?? '-'}
                      </td>

                      <td className="py-4">
                        {revision.annual_ctc ?? '-'}
                      </td>

                      <td className="py-4">
                        {revision.effective_from || '-'}
                      </td>

                      <td className="py-4">
                        <span className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${getStatusClass(revision.status)}`}>
                          {revision.status || '-'}
                        </span>
                      </td>

                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => handleViewRevision(revision.id)}
                          className="rounded-full bg-[#e5e7eb] px-4 py-2 text-[12px] font-semibold text-[#374151]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {revisionPagination?.count > 0 && (
          <AssetRequestsPagination
            pagination={revisionPagination}
            currentPage={currentPage}
            totalPages={totalPages}
            requestsLoading={revisionsLoading}
            onPageChange={handleRevisionPageChange}
          />
        )}
      </div>

      {/* Create Salary Revision Modal */}
      <CreateSalaryRevisionModal
        key={`create-${createModalKey}`}
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreate}
        loading={revisionActionLoading}
        error={revisionActionError}
      />

      {/* Salary Revision Detail Modal */}
      <SalaryRevisionDetailModal
        key={`detail-${detailModalKey}`}
        isOpen={isDetailOpen}
        onClose={handleCloseDetailModal}
        revision={revision}
        loading={revisionDetailLoading}
        error={revisionDetailError}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={revisionActionLoading}
        actionError={revisionActionError}
        canReview={canReviewSalaryRevision}
      />
    </>
  )
}

export default SalaryRevisions
