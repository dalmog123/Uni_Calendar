import { type NextRequest, NextResponse } from "next/server"

// Proxy endpoint has been removed - use /api/chat/generic instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Please use /api/chat/generic instead." },
    { status: 410 }
  )
}
