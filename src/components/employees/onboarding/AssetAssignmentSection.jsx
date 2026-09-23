import Card from '../../ui/Card.jsx'
import CheckboxField from '../../ui/CheckboxField.jsx'

function AssetAssignmentSection({
  assetTypes = [],
  assets,
  onAssetToggle,
}) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">
        Asset Assignment
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assetTypes.map((assetType) => (
          <CheckboxField
            key={assetType.id}
            id={`asset-${assetType.id}`}
            label={assetType.name}
            checked={Boolean(assets[assetType.id])}
            onChange={() =>
              onAssetToggle(assetType.id)
            }
            className="rounded-[16px] border border-[#e5e5e5] bg-[#f8fafc] px-4 py-3"
          />
        ))}
      </div>
    </Card>
  )
}

export default AssetAssignmentSection