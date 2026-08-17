import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const backendUrl = process.env.MONEYPRINTER_API_URL
  if (!backendUrl) return NextResponse.json({ success: false, message: 'MoneyPrinterTurbo backend is not configured.' }, { status: 503 })
  try {
    const { taskId } = await params
    const response = await fetch(`${backendUrl.replace(/\/+$/, '')}/api/v1/tasks/${encodeURIComponent(taskId)}`, { cache: 'no-store' })
    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to read the MoneyPrinterTurbo task status.' }, { status: 503 })
  }
}
