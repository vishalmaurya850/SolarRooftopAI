"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw } from "lucide-react"

interface Analysis {
  id: string
  status: string
  suitabilityScore: number | null
  potentialCapacity: number | null
  createdAt: string
  property: {
    address: string
    city: string
    state: string
  }
}

export function LiveRecentAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAnalyses = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)

    try {
      const response = await fetch("/api/analyses/recent")
      if (response.ok) {
        const data = await response.json()
        setAnalyses(data.analyses)
      }
    } catch (error) {
      console.error("Error fetching recent analyses:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()

    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(() => fetchAnalyses(), 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchAnalyses(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 border rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analyses yet. Start by adding a property!</p>
        <Link href="/properties/new">
          <Button className="mt-4">Add Property</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Analyses</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {analyses.map((analysis) => (
        <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">
              {analysis.property.address}, {analysis.property.city}, {analysis.property.state}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
              {analysis.suitabilityScore && (
                <span className="text-sm text-gray-600">Score: {analysis.suitabilityScore}/100</span>
              )}
              {analysis.potentialCapacity && (
                <span className="text-sm text-gray-600">{analysis.potentialCapacity} kW potential</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{new Date(analysis.createdAt).toLocaleDateString()}</p>
          </div>
          <Link href={`/analysis/${analysis.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}