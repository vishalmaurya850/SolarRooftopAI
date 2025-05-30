"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileImage, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { RealTimeAnalysisStatus } from "@/components/real-time-analysis-status"

interface UploadPageProps {
  params: { id: string }
}

export default function UploadPage({ params }: UploadPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProperty(data.property)
        }
      } catch (error) {
        console.error("Failed to fetch property:", error)
      }
    }

    if (session) {
      fetchProperty()
    }
  }, [params.id, session])

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

      // Save image data to database
      const imageData = {
        propertyId: params.id,
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

      // Start AI analysis
      setIsAnalyzing(true)
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.id,
          imageId: image.id,
          imageUrl: imageUrl,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error("Failed to start analysis")
      }

      const { analysis } = await analysisResponse.json()
      setAnalysisId(analysis.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsAnalyzing(false)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAnalysisComplete = (analysis: any) => {
    router.push(`/analysis/${analysis.id}`)
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-12">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Rooftop Image</h1>
          <p className="text-gray-600">Upload a satellite or aerial image of your property for solar analysis.</p>
          {property && (
            <p className="text-sm text-gray-500 mt-2">
              Property: {property.address}, {property.city}, {property.state}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Image Upload
              </CardTitle>
              <CardDescription>Drag and drop your rooftop image or click to browse files.</CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-yellow-400 bg-yellow-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-yellow-100 rounded-full">
                      <Upload className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Upload Rooftop Image</h3>
                      <p className="text-gray-500 mt-1">
                        {isDragActive ? "Drop the image here" : "Drag & drop or click to select"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">Supports: JPG, PNG, TIFF (max 10MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image src={preview || "/placeholder.svg"} alt="Uploaded rooftop" fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null)
                        setPreview(null)
                      }}
                      disabled={isUploading || isAnalyzing}
                    >
                      Change Image
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {!analysisId && (
                    <Button onClick={handleUpload} disabled={isUploading || isAnalyzing} className="w-full">
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Starting Analysis...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {analysisId && <RealTimeAnalysisStatus analysisId={analysisId} onComplete={handleAnalysisComplete} />}

            <Card>
              <CardHeader>
                <CardTitle>Image Guidelines</CardTitle>
                <CardDescription>For best analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">High Resolution</h4>
                      <p className="text-sm text-gray-600">
                        Use images with at least 1024x768 pixels for accurate analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Clear View</h4>
                      <p className="text-sm text-gray-600">Ensure the entire roof is visible without obstructions</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Daylight</h4>
                      <p className="text-sm text-gray-600">
                        Images taken during daylight provide better analysis results
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Top-Down View</h4>
                      <p className="text-sm text-gray-600">Aerial or satellite views work best for area calculations</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Recent Images</h4>
                      <p className="text-sm text-gray-600">Use recent images to ensure current roof conditions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}