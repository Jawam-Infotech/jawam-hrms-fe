function AssignedAssetsTable({
  assets = [],
  onReturnAsset,
  onReplaceAsset,
}) {
  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'ACTIVE':
        return 'bg-[#ccfbf1] text-[#0d9488]'

      case 'COMPLETED':
        return 'bg-[#dcfce7] text-[#16a34a]'

      default:
        return 'bg-[#f3f4f6] text-[#374151]'
    }
  }

  return (
    <section className="mt-8 w-full rounded-[24px] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[20px] font-black text-[#111827]">
          Assigned Assets
        </h2>

        <p className="mt-1 text-[14px] font-medium text-[#6b7280]">
          View and manage the assets currently assigned to you.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Asset Name
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Asset ID
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Date From
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Status
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-[14px] font-medium text-[#6b7280]"
                >
                  No assets are currently assigned to you.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-[#e5e7eb] transition hover:bg-[#f9fafb]"
                >
                  <td className="px-4 py-4 text-[14px] font-bold text-[#111827]">
                    {asset.asset_type_name || '—'}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-medium text-[#374151]">
                    {asset.asset_tag || '—'}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-medium text-[#374151]">
                    {formatDate(asset.date_from)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${getStatusStyle(
                        asset.status,
                      )}`}
                    >
                      {asset.status || '—'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onReplaceAsset?.(asset)
                        }
                        className="rounded-full border border-[#dc2626] bg-white px-4 py-2 text-[12px] font-bold text-[#dc2626] transition-all hover:bg-[#fef2f2]"
                      >
                        Report Replacement
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onReturnAsset?.(asset)
                        }
                        className="rounded-full border border-[#0d9488] bg-white px-4 py-2 text-[12px] font-bold text-[#0d9488] transition-all hover:bg-[#f0fdfa]"
                      >
                        Return Asset
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AssignedAssetsTable