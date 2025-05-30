"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin } from "lucide-react"

export default function NewPropertyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "RESIDENTIAL",
    roofType: "",
    buildingAge: "",
    electricalPanelCapacity: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="container py-12">Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          buildingAge: formData.buildingAge ? Number.parseInt(formData.buildingAge) : undefined,
          electricalPanelCapacity: formData.electricalPanelCapacity
            ? Number.parseInt(formData.electricalPanelCapacity)
            : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create property")
      }

      const { property } = await response.json()
      router.push(`/properties/${property.id}/upload`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-gray-600">Enter your property details to start the solar analysis process.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Information
          </CardTitle>
          <CardDescription>Provide accurate property details for the most precise solar analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="San Francisco"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="California"
                  required
                />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="94102"
                  required
                />
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roofType">Roof Type (Optional)</Label>
                <Input
                  id="roofType"
                  value={formData.roofType}
                  onChange={(e) => handleInputChange("roofType", e.target.value)}
                  placeholder="Asphalt shingle, Metal, Tile, etc."
                />
              </div>

              <div>
                <Label htmlFor="buildingAge">Building Age (Optional)</Label>
                <Input
                  id="buildingAge"
                  type="number"
                  value={formData.buildingAge}
                  onChange={(e) => handleInputChange("buildingAge", e.target.value)}
                  placeholder="Years"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="electricalPanelCapacity">Electrical Panel Capacity (Optional)</Label>
                <Input
                  id="electricalPanelCapacity"
                  type="number"
                  value={formData.electricalPanelCapacity}
                  onChange={(e) => handleInputChange("electricalPanelCapacity", e.target.value)}
                  placeholder="Amps (e.g., 200)"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Image Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
