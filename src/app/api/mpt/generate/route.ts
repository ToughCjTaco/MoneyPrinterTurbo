import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const backendUrl = process.env.MONEYPRINTER_API_URL
  if (!backendUrl) return NextResponse.json({ success: false, connected: false, error: 'BACKEND_NOT_CONFIGURED', message: 'MoneyPrinterTurbo backend is not configured. Add MONEYPRINTER_API_URL in Vercel Environment Variables.' }, { status: 503 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ success: false, error: 'INVALID_REQUEST', message: 'Invalid request body.' }, { status: 400 }) }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch(`${backendUrl.replace(/\/+$/, '')}/api/v1/videos`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, cache: 'no-store' })
    clearTimeout(timeout)
    const contentType = response.headers.get('content-type') || ''
    let data: unknown = null
    if (contentType.includes('application/json')) data = await response.json().catch(() => null)
    else data = await response.text().catch(() => null)
    if (!response.ok) return NextResponse.json({ success: false, connected: true, error: 'BACKEND_ERROR', status: response.status, message: 'MoneyPrinterTurbo rejected the generation request.', details: data }, { status: response.status })
    return NextResponse.json({ success: true, connected: true, data })
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') return NextResponse.json({ success: false, connected: false, error: 'BACKEND_TIMEOUT', message: 'MoneyPrinterTurbo backend did not respond in time.' }, { status: 504 })
    console.error('MoneyPrinterTurbo connection error:', error)
    return NextResponse.json({ success: false, connected: false, error: 'BACKEND_UNREACHABLE', message: 'Unable to reach the MoneyPrinterTurbo backend. Verify MONEYPRINTER_API_URL and confirm the Python server is online.' }, { status: 503 })
  }
}
