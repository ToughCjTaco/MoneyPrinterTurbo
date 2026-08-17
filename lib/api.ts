export type TaskStatus = { task_id: string; state: number; progress?: number; videos?: string[] | null; combined_videos?: string[] | null; error?: string | null }
export type ApiEnvelope<T> = { status: number; message?: string; data: T }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || 'The generation service is unavailable.')
  return payload as T
}

export function generateScript(topic: string, language = '', paragraph_number = 3) {
  return request<ApiEnvelope<{ video_script: string }>>('/api/mpt/script', { method: 'POST', body: JSON.stringify({ video_subject: topic, video_language: language, paragraph_number }) })
}

export function createVideo(body: Record<string, unknown>) {
  return request<{ success: boolean; data: { status?: number; data: { task_id: string } }; message?: string }>('/api/mpt/generate', { method: 'POST', body: JSON.stringify(body) })
}

export function getTask(taskId: string) { return request<ApiEnvelope<TaskStatus>>(`/api/mpt/tasks/${encodeURIComponent(taskId)}`) }
export function getMediaUrl(file: string) { return file.startsWith('http') ? file : `/api/mpt/media/${file.replace(/^\//, '')}` }
