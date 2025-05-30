import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const propertySchema = z.object({
  userId: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string().default("United States"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "OTHER"]),
  roofType: z.string().optional(),
  buildingAge: z.number().optional(),
  electricalPanelCapacity: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = propertySchema.parse(body)

    const property = await prisma.property.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const properties = await prisma.property.findMany({
      where: { userId },
      include: {
        images: true,
        analyses: {
          include: {
            recommendations: true,
            financialCalculations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error("Properties fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
