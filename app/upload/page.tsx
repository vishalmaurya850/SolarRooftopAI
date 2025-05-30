"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Upload, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function UploadPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setPreview(URL.createObjectURL(file))
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".tiff", ".tif"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/cloudinary-upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  const data = await response.json()
  return data.url
}

  const handleUpload = async () => {
    if (!uploadedFile || !session) return

    setIsUploading(true)
    setError(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload image to cloud storage
      const imageUrl = await uploadToCloudinary(uploadedFile)

      // Save image data to database (optional, adjust as needed)
      const imageData = {
        fileName: uploadedFile.name,
        filePath: imageUrl,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type,
        width: 1024,
        height: 768,
      }

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData),
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to save image data")
      }

      const { image } = await uploadResponse.json()
      setUploadProgress(100)

      // Optionally, start AI analysis here if needed
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: image.propertyId, // Assuming image has propertyId  
          imageId: image.id,
          imageUrl: imageUrl,
        }),
      })
      if (!analysisResponse.ok) {
        throw new Error("Failed to start analysis")
      }
      const { analysis } = await analysisResponse.json()
      setAnalysisId(analysis.id)
      router.push(`/analysis/${analysis.id}`)

      // For now, just redirect to a sample analysis page
      setTimeout(() => {
        // router.push(`/analysis/sample-analysis-id`)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsAnalyzing(false)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6">Upload Rooftop Image</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-yellow-400 bg-yellow-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          {!preview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Upload className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium">Upload Satellite Image</h3>
              <p className="text-gray-500 max-w-md">
                Drag and drop your satellite image here, or click to browse files.
                <br />
                Supported formats: JPG, PNG, TIFF
              </p>
              <Button type="button" variant="outline" className="mt-2">
                Select File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Image preview" fill className="object-cover" />
              </div>
              <p className="text-sm text-gray-500">{uploadedFile?.name}</p>
              {!isUploading && (
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUploadedFile(null)
                      setPreview(null)
                    }}
                  >
                    Change Image
                  </Button>
                  <Button type="button" onClick={handleUpload}>
                    Start Analysis
                  </Button>
                </div>
              )}
            </div>
          )}

          {isUploading && (
            <div className="mt-6 space-y-4">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex items-center justify-center gap-2 text-yellow-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading and processing image...</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">For best results:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use high-resolution satellite or drone imagery</li>
          <li>Ensure the entire roof is visible in the image</li>
          <li>Images should be taken during daylight with minimal cloud cover</li>
          <li>Avoid images with heavy shadows that obscure roof details</li>
          <li>Top-down views work best for accurate area calculations</li>
        </ul>
      </div>
    </div>
  )
}