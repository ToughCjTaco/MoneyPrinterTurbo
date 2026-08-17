import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const backendUrl = process.env.MONEYPRINTER_API_URL
  if (!backendUrl) return NextResponse.json({ success: false, message: 'MoneyPrinterTurbo backend is not configured.' }, { status: 503 })
  try {
    const response = await fetch(`${backendUrl.replace(/\/+$/, '')}/scripts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(await request.json()), cache: 'no-store' })
    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch { return NextResponse.json({ success: false, message: 'Unable to reach the script generation service.' }, { status: 503 }) }
}
