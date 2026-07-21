import Card from '../../ui/Card.jsx'
import CheckboxField from '../../ui/CheckboxField.jsx'
import { EMPLOYEE_ASSET_OPTIONS } from '../../../constants/employeeFormFields.js'

function AssetAssignmentSection({ assets, onAssetToggle }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Asset Assignment</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {EMPLOYEE_ASSET_OPTIONS.map((asset) => (
          <CheckboxField
            key={asset.key}
            id={asset.key}
            label={asset.label}
            checked={Boolean(assets[asset.key])}
            onChange={() => onAssetToggle(asset.key)}
            className="rounded-[16px] border border-[#e5e5e5] bg-[#f8fafc] px-4 py-3"
          />
        ))}
      </div>
    </Card>
  )
}

export default AssetAssignmentSection
