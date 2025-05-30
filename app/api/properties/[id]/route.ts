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

    const property = await prisma.property.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
      include: {
        images: true,
        analyses: {
          include: {
            recommendations: true,
            financialCalculations: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error("Property fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}