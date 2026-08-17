export type TaskStatus = { task_id: string; state: number; progress?: number; videos?: string[] | null; combined_videos?: string[] | null; error?: string | null }
export type ApiEnvelope<T> = { status: number; message?: string; data: T }

const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const endpoint = `${base}/api/v1`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${endpoint}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || `Backend request failed (${response.status})`)
  return payload as T
}

export function generateScript(topic: string, language = '', paragraph_number = 3) {
  return request<ApiEnvelope<{ video_script: string }>>('/scripts', { method: 'POST', body: JSON.stringify({ video_subject: topic, video_language: language, paragraph_number }) })
}
export function createVideo(body: Record<string, unknown>) { return request<ApiEnvelope<{ task_id: string }>>('/videos', { method: 'POST', body: JSON.stringify(body) }) }
export function getTask(taskId: string) { return request<ApiEnvelope<TaskStatus>>(`/tasks/${encodeURIComponent(taskId)}`) }
export function getMediaUrl(file: string) { return file.startsWith('http') ? file : `${base}/${file.replace(/^\//, '')}` }
export { base as API_BASE }
