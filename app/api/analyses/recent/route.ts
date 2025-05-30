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

    const analyses = await prisma.analysis.findMany({
      where: {
        property: { userId: session.user.id },
      },
      include: {
        property: {
          select: {
            address: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({ analyses })
  } catch (error) {
    console.error("Recent analyses fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch recent analyses" }, { status: 500 })
  }
}