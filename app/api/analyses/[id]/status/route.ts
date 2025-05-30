import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params

    const analysis = await prisma.analysis.findFirst({
      where: {
        id: resolvedParams.id,
        property: { userId: session.user.id },
      },
      include: {
        property: true,
        recommendations: true,
        financialCalculations: true,
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Analysis status fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analysis status" }, { status: 500 })
  }
}