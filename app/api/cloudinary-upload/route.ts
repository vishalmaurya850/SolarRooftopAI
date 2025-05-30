import { v2 as cloudinary } from "cloudinary"

// Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

import { NextRequest } from "next/server"

// Helper to parse multipart form data
async function parseFormData(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  return file
}

export async function POST(req: NextRequest) {
  try {
    const file = await parseFormData(req)
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 })
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "solar_rooftop_uploads" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return new Response(JSON.stringify({ url: result.secure_url, public_id: result.public_id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Cloudinary upload failed" }), { status: 500 })
  }
}