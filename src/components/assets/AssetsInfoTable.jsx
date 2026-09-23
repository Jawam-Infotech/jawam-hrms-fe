function AssetsInfoTable({
  inventorySummary = [],
  loading,
  onAssetClick,
}) {


  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#111827]">
          Aggregated Assets Info
        </h2>

        <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
          Overview of assets available across the organization
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Asset Name
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Maintenance
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Available
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Occupied
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Lost
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    Loading assets...
                  </td>
                </tr>
              ) : inventorySummary.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    No asset inventory available.
                  </td>
                </tr>
              ) : (
                inventorySummary.map((asset) => {
                  const available = asset.available_for_assignment ?? 0
      

                  
                  /*
                   * Occupied remains based on backend ACTIVE
                   * and original available count.
                   *
                   * Pending disposal is neither occupied
                   * nor available.
                   */
                  const occupied = Math.max(
                    0,
                    (asset.active ?? 0) -
                      (asset.available_for_assignment ?? 0),
                  )

                  return (
                    <tr
                      key={asset.asset_type_id}
                      onClick={() =>
                        onAssetClick?.(asset)
                      }
                      className="cursor-pointer border-b border-[#e5e7eb] transition hover:bg-[#f9fafb]"
                    >
                      {/* Asset Name */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#111827]">
                          {asset.asset_type_name || '—'}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {asset.total ?? 0}
                      </td>

                      {/* Maintenance */}
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {asset.under_maintenance ?? 0}
                      </td>

                      {/* Available */}
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {available}
                      </td>

                      {/* Occupied */}
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {occupied}
                      </td>

                      {/* Lost */}
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {asset.lost ?? 0}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AssetsInfoTable