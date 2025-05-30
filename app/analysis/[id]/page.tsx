import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Image from "next/image"
import { Download, ArrowRight, Check, Info, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function getAnalysisData(id: string, userId: string) {
  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      property: { userId },
    },
    include: {
      property: {
        include: { user: true },
      },
      image: true,
      recommendations: {
        include: { panelType: true },
      },
      financialCalculations: true,
      analysisHistory: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return analysis
}

interface AnalysisPageProps {
  params: { id: string }
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const analysisData = await getAnalysisData(resolvedParams.id, session.user.id)

  if (!analysisData) {
    notFound()
  }

  const recommendation = analysisData.recommendations[0]
  const financial = analysisData.financialCalculations[0]

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Solar Analysis Results</h1>
          <p className="text-gray-600">
            {analysisData.property.address}, {analysisData.property.city}, {analysisData.property.state}
          </p>
          <p className="text-sm text-gray-500">Analysis ID: {resolvedParams.id}</p>
        </div>
        {/* <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-2">
            Get Quotes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Analyzed Rooftop</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  <Check className="h-3 w-3 mr-1" />
                  {analysisData.status === "COMPLETED" ? "Analysis Complete" : analysisData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image
                  src={analysisData.image?.filePath || "/placeholder.svg?height=400&width=600"}
                  alt="Analyzed rooftop"
                  fill
                  className="object-cover"
                />
                {analysisData.usableArea && (
                  <div className="absolute inset-0 bg-black/10">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-yellow-500 bg-yellow-500/20 rounded-sm">
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Optimal Panel Area: {analysisData.usableArea}m²
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="analysis" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="analysis">Solar Potential</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="financials">ROI & Financials</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Roof Characteristics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Roof Area</p>
                            <p className="font-medium">{analysisData.roofArea || "N/A"} m²</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Usable Area</p>
                            <p className="font-medium">
                              {analysisData.usableArea || "N/A"} m²
                              {analysisData.roofArea && analysisData.usableArea && (
                                <span> ({Math.round((analysisData.usableArea / analysisData.roofArea) * 100)}%)</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Orientation</p>
                            <p className="font-medium">{analysisData.orientation || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Roof Tilt</p>
                            <p className="font-medium">{analysisData.tilt || "N/A"}°</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Shading Analysis</p>
                          <p className="font-medium">{analysisData.shading || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Solar Potential</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Annual Sun Hours</p>
                          <p className="font-medium">{analysisData.annualSunHours || "N/A"} hours</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Potential Capacity</p>
                            <p className="font-medium">{analysisData.potentialCapacity || "N/A"} kW</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Annual Production</p>
                            <p className="font-medium">
                              {analysisData.annualProduction?.toLocaleString() || "N/A"} kWh
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Analysis Confidence</p>
                          <p className="font-medium">
                            {analysisData.confidenceScore
                              ? Math.round(analysisData.confidenceScore * 100) + "%"
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="installation">
              {recommendation ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Installation Recommendations</CardTitle>
                    <CardDescription>Optimal equipment and setup based on your roof analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm text-gray-500">Recommended Panel Count</h4>
                          <p className="font-medium">{recommendation.panelCount || "N/A"} panels</p>
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-500">Mounting System</h4>
                          <p className="font-medium">{recommendation.mountingSystem || "N/A"}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm text-gray-500">Inverter Type</h4>
                          <p className="font-medium">{recommendation.inverterType || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-500">Installation Notes</h4>
                          <p className="font-medium">{recommendation.additionalNotes || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">No installation recommendations available yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="financials">
              {financial ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                    <CardDescription>Cost breakdown and return on investment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">System Cost</span>
                            <span>₹{financial.estimatedCost?.toLocaleString() || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Federal Tax Credit (30%)</span>
                            <span>-₹{financial.federalTaxCredit?.toLocaleString() || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>State Incentives</span>
                            <span>-₹{financial.stateTaxCredit?.toLocaleString() || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Utility Rebates</span>
                            <span>-₹{financial.utilityRebate?.toLocaleString() || "N/A"}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Net System Cost</span>
                            <span>₹{financial.netCost?.toLocaleString() || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Financial Benefits</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Annual Savings</span>
                              <span className="font-medium">₹{financial.annualSavings?.toLocaleString() || "N/A"}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payback Period</span>
                              <span className="font-medium">{financial.paybackPeriod || "N/A"} years</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">25-Year ROI</span>
                              <span className="font-medium">{financial.roi25Year || "N/A"}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md">
                            <span className="text-sm">CO₂ Reduction: {financial.co2Reduction || "N/A"} tons/year</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">No financial analysis available yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Solar Suitability</CardTitle>
              <CardDescription>Overall assessment of your roof</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Suitability Score</span>
                    <span className="font-bold">{analysisData.suitabilityScore || "N/A"}/100</span>
                  </div>
                  {analysisData.suitabilityScore && (
                    <>
                      <Progress value={analysisData.suitabilityScore} className="h-3" />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </>
                  )}
                </div>

                {analysisData.suitabilityScore && analysisData.suitabilityScore > 70 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-2 items-center text-green-700 font-medium mb-2">
                      <Check className="h-5 w-5" />
                      <span>Your roof is well-suited for solar</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Based on our analysis, your roof has excellent solar potential with minimal shading and optimal
                      orientation.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential System Size</span>
                    <span className="font-medium">{analysisData.potentialCapacity || "N/A"} kW</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Production</span>
                    <span className="font-medium">{analysisData.annualProduction?.toLocaleString() || "N/A"} kWh</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Payback</span>
                    <span className="font-medium">{financial?.paybackPeriod || "N/A"} years</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>What to do with your analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Get Installation Quotes</Button>
                <Button variant="outline" className="w-full">
                  Download Detailed Report
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      <Alert className="mt-12">
        <Info className="h-4 w-4" />
        <AlertTitle>About This Analysis</AlertTitle>
        <AlertDescription>
          This analysis is generated using AI-powered computer vision to assess your rooftop's solar potential. While we
          strive for accuracy, we recommend consulting with a professional solar installer for a detailed on-site
          assessment. Actual solar production may vary based on weather conditions, future shading changes, and other
          factors.
        </AlertDescription>
      </Alert>
    </div>
  )
}
