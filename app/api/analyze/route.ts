import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { analyzeRooftopImage, calculateFinancials } from "@/lib/ai-analysis"
import { z } from "zod"

const analyzeSchema = z.object({
  propertyId: z.string(),
  imageId: z.string(),
  imageUrl: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId, imageId, imageUrl } = analyzeSchema.parse(body)

    // Get property data
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        propertyId,
        imageId,
        status: "PROCESSING",
        aiModelUsed: "models/gemini-1.0-pro-vision-latest",
      },
    })

    try {
      // Perform AI analysis
      const startTime = Date.now()
      const analysisResult = await analyzeRooftopImage(imageUrl, property)
      const processingTime = Math.round((Date.now() - startTime) / 1000)

      // Get location data for financial calculations
      const locationData = await prisma.region.findFirst({
        where: { state: property.state },
      })

      // Calculate financials
      const financialData = calculateFinancials(analysisResult, locationData)

      // Update analysis with results
      const updatedAnalysis = await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          status: "COMPLETED",
          roofArea: analysisResult.roofArea,
          usableArea: analysisResult.usableArea,
          orientation: analysisResult.orientation,
          tilt: analysisResult.tilt,
          shading: analysisResult.shading,
          annualSunHours: analysisResult.annualSunHours,
          potentialCapacity: analysisResult.potentialCapacity,
          annualProduction: analysisResult.annualProduction,
          confidenceScore: analysisResult.confidenceScore,
          suitabilityScore: analysisResult.suitabilityScore,
          processingTime,
          analysisData: {
            obstacles: analysisResult.obstacles,
            recommendations: analysisResult.recommendations,
          },
        },
      })

      // Create recommendation
      await prisma.recommendation.create({
        data: {
          analysisId: analysis.id,
          panelCount: Math.floor(analysisResult.usableArea / 2), // Rough estimate
          mountingSystem: "Flush mount",
          inverterType: "String inverter",
          installationComplexity: analysisResult.suitabilityScore > 80 ? "Low" : "Medium",
          additionalNotes: analysisResult.recommendations.join(". "),
        },
      })

      // Create financial calculation
      await prisma.financialCalculation.create({
        data: {
          analysisId: analysis.id,
          ...financialData,
        },
      })

      // Log analysis history
      await prisma.analysisHistory.create({
        data: {
          analysisId: analysis.id,
          userId: property.userId,
          action: "ANALYSIS_COMPLETED",
          details: {
            processingTime,
            confidenceScore: analysisResult.confidenceScore,
            suitabilityScore: analysisResult.suitabilityScore,
          },
        },
      })

      return NextResponse.json({
        analysis: updatedAnalysis,
        message: "Analysis completed successfully",
      })
    } catch (analysisError) {
      // Update analysis status to failed
      await prisma.analysis.update({
        where: { id: analysis.id },
        data: { status: "FAILED" },
      })

      console.error("Analysis error:", analysisError)
      return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Analysis request error:", error)
    return NextResponse.json({ error: "Failed to process analysis request" }, { status: 500 })
  }
}
