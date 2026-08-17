import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const backendUrl = process.env.MONEYPRINTER_API_URL
  if (!backendUrl) return NextResponse.json({ connected: false, status: 'not_configured', message: 'MoneyPrinterTurbo backend is not configured.' })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch(`${backendUrl.replace(/\/+$/, '')}/ping`, { signal: controller.signal, cache: 'no-store' })
    clearTimeout(timer)
    const body = await response.text().catch(() => '')
    return NextResponse.json({ connected: response.ok, status: response.ok ? 'online' : 'error', message: response.ok ? 'MoneyPrinterTurbo backend connected.' : `Backend returned ${response.status}.`, details: body.slice(0, 300) })
  } catch {
    clearTimeout(timer)
    return NextResponse.json({ connected: false, status: 'offline', message: 'MoneyPrinterTurbo backend is offline or unreachable.' })
  }
}
