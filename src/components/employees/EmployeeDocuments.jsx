import Card from '../ui/Card.jsx'

function EmployeeDocuments({ documents = [] }) {
  const getDocumentUrl = (document) => document.previewUrl || document.url || document.fileUrl || document.file

  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h2 className="mb-6 text-xl font-bold text-[#111827]">
        Documents
      </h2>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#d1d5db] p-8 text-center text-[#6b7280]">
          No documents available.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between rounded-lg border border-[#e5e7eb] p-4"
            >
              <div>
                <p className="font-medium text-[#111827]">
                  {document.name}
                </p>
                <p className="text-sm text-[#6b7280]">
                  {document.type}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {getDocumentUrl(document) ? (
                  <>
                    <a
                      className="rounded-lg bg-[#04A3DA] px-4 py-2 text-sm font-medium text-white"
                      href={getDocumentUrl(document)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Preview
                    </a>
                    <a
                      className="rounded-lg border border-[#04A3DA] px-4 py-2 text-sm font-medium text-[#04A3DA]"
                      href={document.downloadUrl || getDocumentUrl(document)}
                      download
                    >
                      Download
                    </a>
                  </>
                ) : (
                  <span className="rounded-lg bg-[#f3f4f6] px-4 py-2 text-sm font-medium text-[#6b7280]">
                    Not available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default EmployeeDocuments
