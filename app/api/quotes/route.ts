import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const quoteSchema = z.object({
  analysisId: z.string(),
  userId: z.string(),
  installerId: z.string().optional(),
  quoteAmount: z.number().optional(),
  installationTimeline: z.string().optional(),
  warrantyDetails: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = quoteSchema.parse(body)

    const quote = await prisma.quote.create({
      data: {
        ...data,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      include: {
        analysis: {
          include: { property: true },
        },
        installer: true,
        user: true,
      },
    })

    return NextResponse.json({ quote }, { status: 201 })
  } catch (error) {
    console.error("Quote creation error:", error)
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const analysisId = searchParams.get("analysisId")

    const where: any = {}
    if (userId) where.userId = userId
    if (analysisId) where.analysisId = analysisId

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        analysis: {
          include: { property: true },
        },
        installer: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error("Quotes fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}
