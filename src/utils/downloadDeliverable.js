import { projectsApi } from '../services/api/projects.api.js'
import { downloadBlobResponse } from './downloadFile.js'

/**
 * Downloads a private deliverable attachment via authenticated E24 GET endpoint.
 * Fetches binary stream into memory and triggers browser download.
 */
export async function downloadDeliverable(projectId, taskId, submissionId, fileId, originalName = 'deliverable') {
  const response = await projectsApi.downloadDeliverableFile(projectId, taskId, submissionId, fileId)
  downloadBlobResponse(response, originalName)
}

export default downloadDeliverable
