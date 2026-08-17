import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const backendUrl = process.env.MONEYPRINTER_API_URL
  if (!backendUrl) return NextResponse.json({ connected: false, status: 'not_configured', message: 'MoneyPrinterTurbo backend is not configured.' })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const origin = backendUrl.replace(/\/+$/, '')
    const response = await fetch(`${origin}/openapi.json?health_check=${Date.now()}`, { signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' } })
    clearTimeout(timer)
    const body = await response.text().catch(() => '')
    const contentType = response.headers.get('content-type') || ''
    const looksLikeApi = contentType.includes('application/json') && body.includes('openapi')
    return NextResponse.json({ connected: response.ok && looksLikeApi, status: response.ok && looksLikeApi ? 'online' : 'error', message: response.ok && looksLikeApi ? 'MoneyPrinterTurbo backend connected.' : `Backend returned ${response.status} without a valid FastAPI OpenAPI document.`, details: body.slice(0, 300) })
  } catch {
    clearTimeout(timer)
    return NextResponse.json({ connected: false, status: 'offline', message: 'MoneyPrinterTurbo backend is offline or unreachable.' })
  }
}
