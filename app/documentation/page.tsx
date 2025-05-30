import Link from "next/link"
import { FileText, Code, BookOpen, Download, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DocumentationPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-gray-600">Complete guide to using SolarScan AI</p>
        </div>
        {/* <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF Guide
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader>
            <div className="p-2 bg-yellow-100 rounded-full w-fit">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="mt-4">User Guide</CardTitle>
            <CardDescription>Learn how to use the SolarScan AI platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Step-by-step instructions for uploading images, interpreting results, and making decisions based on your
              solar analysis.
            </p>
            <Link href="#setup" className="text-yellow-600 font-medium hover:underline">
              Read the guide →
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader>
            <div className="p-2 bg-yellow-100 rounded-full w-fit">
              <Code className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="mt-4">API Reference</CardTitle>
            <CardDescription>Integrate with our solar analysis API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Technical documentation for developers looking to integrate SolarScan AI capabilities into their own
              applications.
            </p>
            {/* <Link href="#api-reference" className="text-yellow-600 font-medium hover:underline">
              View API docs →
            </Link> */}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader>
            <div className="p-2 bg-yellow-100 rounded-full w-fit">
              <BookOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="mt-4">Solar Knowledge Base</CardTitle>
            <CardDescription>Learn about solar technology and installation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Educational resources about solar panel technology, installation processes, maintenance requirements, and
              more.
            </p>
            {/* <Link href="#knowledge-base" className="text-yellow-600 font-medium hover:underline">
              Explore resources →
            </Link> */}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="space-y-8">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="examples">Example Use Cases</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="future">Future Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Setup Instructions</CardTitle>
              <CardDescription>How to set up and run the SolarScan AI platform locally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Node.js 18.0 or higher</li>
                  <li>PostgreSQL database (NeonDB recommended)</li>
                  <li>OpenAI API key for AI analysis</li>
                  <li>Vercel account for deployment (optional)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Environment Variables</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm">
                    {`NEXTAUTH_SECRET=your_secret_key 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# Recommended for most uses
DATABASE_URL=postgresql://username:password@host:port/database
# For NeonDB
OPENROUTER_API_KEY=your_openrouter_api_key"`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Installation Steps</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">1. Clone the repository</h4>
                    <pre className="text-sm text-gray-700">git clone https://github.com/your-repo/solarscan-ai.git</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">2. Install dependencies</h4>
                    <pre className="text-sm text-gray-700">npm install</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">3. Set up the database</h4>
                    <pre className="text-sm text-gray-700">npx prisma generate && npx prisma migrate dev</pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">5. Start the development server</h4>
                    <pre className="text-sm text-gray-700">npm run dev</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Use Cases</CardTitle>
              <CardDescription>Real-world scenarios and how to handle them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Residential Solar Assessment</h3>
                <p className="text-gray-700 mb-4">
                  A homeowner wants to assess their roof's solar potential before contacting installers.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Upload satellite image of the property</li>
                    <li>AI analyzes roof area, orientation, and shading</li>
                    <li>System calculates potential capacity and production</li>
                    <li>Financial analysis shows ROI and payback period</li>
                    <li>Homeowner receives installer recommendations</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Commercial Property Evaluation</h3>
                <p className="text-gray-700 mb-4">
                  A business owner evaluates multiple properties for solar installation.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Features Used:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Bulk property analysis</li>
                    <li>Commercial-grade financial modeling</li>
                    <li>Tax incentive calculations</li>
                    <li>Installer network for commercial projects</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Solar Installer Workflow</h3>
                <p className="text-gray-700 mb-4">
                  A solar installer uses the platform to pre-qualify leads and provide quick estimates.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Workflow:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Customer uploads property image</li>
                    <li>Installer reviews AI analysis</li>
                    <li>Installer provides customized quote</li>
                    <li>Customer compares multiple installer quotes</li>
                    <li>Installation project begins</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>Architecture and technology stack details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Technology Stack</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Next.js 14 with App Router</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• shadcn/ui component library</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Backend</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Next.js API routes</li>
                      <li>• Prisma ORM</li>
                      <li>• NeonDB PostgreSQL</li>
                      <li>• Google Gemini flash Vision</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">AI Integration</h3>
                <p className="text-gray-700 mb-4">
                  The system uses Google Gemini flash Vision model to analyze rooftop images and extract relevant data for
                  solar potential assessment.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Analysis Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Image preprocessing and validation</li>
                    <li>AI model analyzes roof characteristics</li>
                    <li>Structured data extraction using Zod schemas</li>
                    <li>Financial calculations based on location data</li>
                    <li>Confidence scoring and validation</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Database Schema</h3>
                <p className="text-gray-700 mb-4">
                  The application uses a comprehensive database schema designed for scalability and data integrity.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Key Tables:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Users - Authentication and profile data</li>
                    <li>Properties - Property information and location</li>
                    <li>Images - Uploaded satellite imagery</li>
                    <li>Analyses - AI analysis results</li>
                    <li>Recommendations - Installation recommendations</li>
                    <li>Financial Calculations - ROI and cost data</li>
                    <li>Installers - Solar installer directory</li>
                    <li>Quotes - Installation quotes and proposals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="future" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Future Improvements</CardTitle>
              <CardDescription>Planned enhancements and feature roadmap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Short-term Improvements (3-6 months)</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Enhanced AI Accuracy</h4>
                      <p className="text-sm text-gray-600">
                        Improve roof detection and measurement accuracy through model fine-tuning
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Mobile App</h4>
                      <p className="text-sm text-gray-600">Native mobile applications for iOS and Android</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Real-time Weather Integration</h4>
                      <p className="text-sm text-gray-600">
                        Incorporate live weather data for more accurate production estimates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Medium-term Features (6-12 months)</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">3D Roof Modeling</h4>
                      <p className="text-sm text-gray-600">
                        Generate 3D models for more precise panel placement optimization
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Battery Storage Analysis</h4>
                      <p className="text-sm text-gray-600">
                        Include battery storage recommendations and financial analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Marketplace Integration</h4>
                      <p className="text-sm text-gray-600">Direct integration with solar equipment marketplaces</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Long-term Vision (12+ months)</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">AI-Powered Design Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Automated solar system design with optimal panel placement
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Predictive Maintenance</h4>
                      <p className="text-sm text-gray-600">
                        AI-driven maintenance scheduling and performance monitoring
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Global Expansion</h4>
                      <p className="text-sm text-gray-600">
                        Support for international markets with local regulations and incentives
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertTitle>Contributing</AlertTitle>
            <AlertDescription>
              We welcome contributions from the community. Check our GitHub repository for open issues and contribution
              guidelines.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
