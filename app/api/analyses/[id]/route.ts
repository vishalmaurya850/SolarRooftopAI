import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
      include: {
        property: {
          include: { user: true },
        },
        image: true,
        recommendations: {
          include: { panelType: true },
        },
        financialCalculations: true,
        analysisHistory: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Analysis fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
  }
}
