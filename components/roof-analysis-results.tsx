import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, Sun, AreaChart } from "lucide-react"

interface RoofAnalysisResultsProps {
  data: {
    roofArea: number
    usableArea: number
    orientation: string
    tilt: number
    shading: string
    annualSunHours: number
    potentialCapacity: number
    annualProduction: number
    confidence: number
    suitabilityScore: number
  }
}

export function RoofAnalysisResults({ data }: RoofAnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AreaChart className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Roof Characteristics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Roof Area</p>
                  <p className="font-medium">{data.roofArea} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usable Area</p>
                  <p className="font-medium">
                    {data.usableArea} m² ({Math.round((data.usableArea / data.roofArea) * 100)}%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Orientation</p>
                  <div className="flex items-center gap-1">
                    <Compass className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{data.orientation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roof Tilt</p>
                  <p className="font-medium">{data.tilt}°</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Shading Analysis</p>
                <p className="font-medium">{data.shading}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Solar Potential</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Annual Sun Hours</p>
                <p className="font-medium">{data.annualSunHours} hours</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Potential Capacity</p>
                  <p className="font-medium">{data.potentialCapacity} kW</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Production</p>
                  <p className="font-medium">{data.annualProduction.toLocaleString()} kWh</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Analysis Confidence</p>
                <p className="font-medium">{Math.round(data.confidence * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Solar Analysis</CardTitle>
          <CardDescription>Comprehensive assessment of your roof's solar generation potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Orientation Assessment</h4>
              <p className="text-gray-700">
                Your roof has a {data.orientation.toLowerCase()} orientation, which is
                {data.orientation.includes("South") ? " ideal " : " acceptable "}
                for solar panel installation in the Northern Hemisphere. This orientation allows for
                {data.orientation.includes("South") ? " maximum " : " good "}
                sun exposure throughout the day.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Shading Analysis</h4>
              <p className="text-gray-700">
                The analysis detected {data.shading.toLowerCase()} shading on your roof.
                {data.shading === "Minimal"
                  ? " This is excellent for solar production as panels will receive direct sunlight throughout most of the day."
                  : data.shading === "Moderate"
                    ? " Some shading occurs during parts of the day, which may slightly reduce overall production. Consider microinverters or power optimizers to mitigate shading effects."
                    : " Significant shading may impact solar production. We recommend tree trimming or using microinverters/power optimizers to maximize energy harvest."}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Production Estimate</h4>
              <p className="text-gray-700">
                Based on your roof characteristics, local weather patterns, and solar irradiance data, we estimate your
                system could produce approximately {data.annualProduction.toLocaleString()} kWh annually. This is
                equivalent to offsetting about {Math.round(data.annualProduction / 900)} tons of CO₂ emissions per year.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
