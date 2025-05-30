"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface AnalysisStatusProps {
  analysisId: string
  onComplete?: (analysis: any) => void
}

export function RealTimeAnalysisStatus({ analysisId, onComplete }: AnalysisStatusProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/analyses/${analysisId}/status`)
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data.analysis)

          // Update progress based on status
          switch (data.analysis.status) {
            case "PENDING":
              setProgress(10)
              break
            case "PROCESSING":
              setProgress(50)
              break
            case "COMPLETED":
              setProgress(100)
              setIsLoading(false)
              if (onComplete) {
                onComplete(data.analysis)
              }
              clearInterval(interval)
              break
            case "FAILED":
              setProgress(0)
              setIsLoading(false)
              clearInterval(interval)
              break
          }
        }
      } catch (error) {
        console.error("Error checking analysis status:", error)
      }
    }

    // Initial check
    checkStatus()

    // Set up polling for real-time updates
    interval = setInterval(checkStatus, 2000) // Check every 2 seconds

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [analysisId, onComplete])

  const getStatusIcon = () => {
    switch (analysis?.status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "PROCESSING":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (analysis?.status) {
      case "PENDING":
        return "secondary"
      case "PROCESSING":
        return "default"
      case "COMPLETED":
        return "default"
      case "FAILED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Analysis Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={getStatusColor()}>{analysis?.status || "INITIALIZING"}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {analysis?.status === "PROCESSING" && (
            <div className="text-sm text-gray-600">
              <p>AI is analyzing your rooftop image...</p>
              <p className="text-xs mt-1">This usually takes 30-60 seconds</p>
            </div>
          )}

          {analysis?.status === "COMPLETED" && (
            <div className="text-sm text-green-600">
              <p>Analysis completed successfully!</p>
              <p className="text-xs mt-1">
                Confidence: {analysis.confidenceScore ? Math.round(analysis.confidenceScore * 100) : 0}%
              </p>
            </div>
          )}

          {analysis?.status === "FAILED" && (
            <div className="text-sm text-red-600">
              <p>Analysis failed. Please try again.</p>
            </div>
          )}

          {analysis?.processingTime && (
            <div className="text-xs text-gray-500">Processing time: {analysis.processingTime}s</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}