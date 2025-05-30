import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InstallationRecommendationsProps {
  data: {
    panelType: string
    panelCount: number
    mountingSystem: string
    inverterType: string
    additionalNotes: string
  }
}

export function InstallationRecommendations({ data }: InstallationRecommendationsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended System Configuration</CardTitle>
          <CardDescription>Optimal equipment and setup based on your roof analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Recommended Panel Type</h4>
                <p className="font-medium">{data.panelType}</p>
                <p className="text-sm text-gray-600 mt-1">
                  High-efficiency panels with excellent performance in various light conditions
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500">Estimated Panel Count</h4>
                <p className="font-medium">{data.panelCount} panels</p>
                <p className="text-sm text-gray-600 mt-1">
                  Based on standard 380W panels and your available roof space
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Mounting System</h4>
                <p className="font-medium">{data.mountingSystem}</p>
                <p className="text-sm text-gray-600 mt-1">Secure attachment directly to your roof structure</p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500">Inverter Recommendation</h4>
                <p className="font-medium">{data.inverterType}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Efficient conversion of DC power from panels to AC power for your home
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Installation Note</AlertTitle>
            <AlertDescription>{data.additionalNotes}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installation Considerations</CardTitle>
          <CardDescription>Important factors to consider for your solar installation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Roof Condition</h4>
              <p className="text-gray-700">
                Based on the imagery analysis, your roof appears to be in good condition for solar installation.
                However, we recommend a professional inspection to verify structural integrity before installation. If
                your roof is older than 10 years, consider replacing it before installing solar panels to avoid the cost
                of removing and reinstalling panels later.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Electrical System</h4>
              <p className="text-gray-700">
                Your solar installation will need to connect to your home's electrical system. Depending on the age and
                capacity of your electrical panel, an upgrade may be necessary. A professional electrician should
                evaluate your current setup to determine if any upgrades are required.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Permits and Regulations</h4>
              <p className="text-gray-700">
                Solar installations typically require permits from local authorities. Requirements vary by location, but
                generally include electrical permits, building permits, and possibly HOA approval. Your solar installer
                should handle the permitting process, but be aware that this can add time to your installation timeline.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Advantages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Excellent roof orientation for maximum solar production</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Minimal shading allows for optimal energy generation</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  Sufficient usable area for a system that can offset a significant portion of electricity usage
                </span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Simple mounting system requirements reduce installation costs</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <span>Professional roof inspection recommended before installation</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <span>Electrical panel may require upgrades to accommodate solar system</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <span>Local permitting process may add time to installation timeline</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <span>Weather patterns in your area may affect seasonal production</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
