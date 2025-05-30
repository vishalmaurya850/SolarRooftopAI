import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [properties, analyses, financialData] = await Promise.all([
      prisma.property.count({
        where: { userId: session.user.id },
      }),
      prisma.analysis.findMany({
        where: {
          property: { userId: session.user.id },
          status: "COMPLETED",
        },
        include: {
          financialCalculations: true,
        },
      }),
      prisma.financialCalculation.aggregate({
        where: {
          analysis: {
            property: { userId: session.user.id },
          },
        },
        _sum: {
          annualSavings: true,
          co2Reduction: true,
        },
      }),
    ])

    const totalSavings = financialData._sum.annualSavings || 0
    const co2Reduction = financialData._sum.co2Reduction || 0

    const stats = {
      totalProperties: properties,
      completedAnalyses: analyses.length,
      totalSavings: Math.round(totalSavings * 25), // 25-year projection
      co2Reduction: Math.round(co2Reduction * 10) / 10,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}