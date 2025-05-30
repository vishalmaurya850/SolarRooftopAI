import { Search, MapPin, Star, Phone, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"

async function getInstallers() {
  return await prisma.installer.findMany({
    orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
    take: 20,
  })
}

export default async function InstallersPage() {
  const installers = await getInstallers()

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Solar Installers</h1>
        <p className="text-gray-600">Connect with certified solar installers in your area</p>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input placeholder="Enter your city or ZIP code" className="w-full" />
          </div>
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {installers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No installers found. Please check back later.</p>
                </CardContent>
              </Card>
            ) : (
              installers.map((installer) => (
                <Card key={installer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{installer.companyName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {installer.city && installer.state
                            ? `${installer.city}, ${installer.state}`
                            : "Location not specified"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{installer.rating || "N/A"}</span>
                          <span className="text-gray-500">({installer.reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {installer.certifications && (
                        <div>
                          <h4 className="font-medium mb-2">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(installer.certifications) ? (
                              installer.certifications
                                .filter((cert): cert is string => typeof cert === "string")
                                .map((cert, index) => (
                                  <Badge key={index} variant="secondary">
                                    {cert}
                                  </Badge>
                                ))
                            ) : (
                              <Badge variant="secondary">Certified Installer</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {installer.serviceAreas && (
                        <div>
                          <h4 className="font-medium mb-2">Service Areas</h4>
                          <p className="text-gray-600">
                            {Array.isArray(installer.serviceAreas)
                              ? installer.serviceAreas.join(", ")
                              : "Service areas not specified"}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4">
                        <Button className="gap-2">
                          <Phone className="h-4 w-4" />
                          {installer.contactPhone || "Contact"}
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Website
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>How to Choose an Installer</CardTitle>
              <CardDescription>Tips for selecting the right solar installer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Check Certifications</h4>
                  <p className="text-sm text-gray-600">
                    Look for NABCEP certification and manufacturer-specific training
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Read Reviews</h4>
                  <p className="text-sm text-gray-600">Check online reviews and ask for local references</p>
                </div>
                <div>
                  <h4 className="font-medium">Compare Quotes</h4>
                  <p className="text-sm text-gray-600">Get multiple quotes to compare pricing and equipment</p>
                </div>
                <div>
                  <h4 className="font-medium">Verify Licensing</h4>
                  <p className="text-sm text-gray-600">Ensure proper licensing and insurance coverage</p>
                </div>
                <div>
                  <h4 className="font-medium">Warranty Terms</h4>
                  <p className="text-sm text-gray-600">Understand workmanship and equipment warranties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
