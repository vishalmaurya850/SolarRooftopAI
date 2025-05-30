import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const uploadSchema = z.object({
  propertyId: z.string().optional(),
  fileName: z.string(),
  filePath: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})
import { getToken } from "next-auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = uploadSchema.parse(body)

    // Get the user token and extract userId
    const token = await getToken({ req: request })
    const userId = token?.userId

    // Generate a custom propertyId if not provided
    let propertyId = data.propertyId
    if (!propertyId) {
      propertyId = crypto.randomUUID()
      if (!userId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
      }
      // Create a minimal property record (customize as needed)
      await prisma.property.create({
        data: {
          id: propertyId,
          address: "Unknown",
          city: "Unknown",
          state: "Unknown",
          zipCode: "00000",
          country: "Unknown",
          propertyType: "OTHER",
          userId: userId,
        },
      })
    }
    const image = await prisma.image.create({
      data: {
        ...data,
        propertyId,
      },
    })

    return NextResponse.json({ image, propertyId }, { status: 201 })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}