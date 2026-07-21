import Card from '../../ui/Card.jsx'
import DocumentUploadItem from './DocumentUploadItem.jsx'
import { EMPLOYEE_DOCUMENT_TYPES } from '../../../constants/employeeFormFields.js'

function DocumentUploadSection({ documents, onDocumentChange, onDocumentPreview }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Employment Documents</h3>
      <div className="space-y-3">
        {EMPLOYEE_DOCUMENT_TYPES.map((documentType) => {
          const document = documents[documentType.key]

          return (
            <DocumentUploadItem
              key={documentType.key}
              label={documentType.label}
              status={document?.status || 'Pending'}
              hasFile={Boolean(document?.fileName)}
              onUpload={(file) => onDocumentChange(documentType.key, file)}
              onPreview={() => onDocumentPreview(documentType.key)}
            />
          )
        })}
      </div>
    </Card>
  )
}

export default DocumentUploadSection
