import Card from '../ui/Card.jsx'

function EmployeeAssets({ assets = [] }) {
  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h2 className="mb-6 text-xl font-bold text-[#111827]">
        Assets
      </h2>

      {assets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#d1d5db] p-8 text-center text-[#6b7280]">
          No assets assigned.
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between rounded-lg border border-[#e5e7eb] p-4"
            >
              <div>
                <p className="font-medium text-[#111827]">
                  {asset.name}
                </p>

                <p className="text-sm text-[#6b7280]">
                  {asset.serialNumber}
                </p>
              </div>

              <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#16a34a]">
                Assigned
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default EmployeeAssets