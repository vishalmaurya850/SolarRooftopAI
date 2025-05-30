import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Upload, Sun, BarChart3, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ss from "./solar.jpg" // Replace with your actual image path

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-yellow-50 to-white py-20">
          <div className="container flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                AI-Powered Solar <span className="text-yellow-500">Rooftop Analysis</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Upload satellite imagery of any rooftop and get instant AI-powered assessments of solar potential,
                installation recommendations, and ROI estimates.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2">
                    Analyze Your Roof <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/documentation">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={ss}
                  alt="Solar panel installation on a residential roof"
                  width={600}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Analyze Your Rooftop</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload a satellite image of your rooftop to get started with your solar potential assessment.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-yellow-100 rounded-full">
                      <Upload className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-medium">Upload Satellite Image</h3>
                    <p className="text-gray-500 max-w-md">
                      Drag and drop your satellite image here, or click to browse files. Supported formats: JPG, PNG,
                      TIFF
                    </p>
                    <Link href="/auth/signup">
                      <Button className="mt-4">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Solar Analysis</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered tool provides detailed insights to help you make informed decisions about solar
                installation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="p-2 bg-yellow-100 rounded-full w-fit">
                    <Sun className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="mt-4">Solar Potential Assessment</CardTitle>
                  <CardDescription>
                    Get accurate estimates of your roof's solar energy generation potential.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our AI analyzes roof orientation, shading, available area, and local solar irradiance to calculate
                    optimal panel placement and energy output.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-2 bg-yellow-100 rounded-full w-fit">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="mt-4">Installation Recommendations</CardTitle>
                  <CardDescription>Receive tailored installation guidance based on your specific roof.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get recommendations on panel types, mounting systems, and installation considerations specific to
                    your roof structure and location.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="p-2 bg-yellow-100 rounded-full w-fit">
                    <Calculator className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="mt-4">ROI & Cost Analysis</CardTitle>
                  <CardDescription>Understand the financial benefits of your solar investment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Calculate installation costs, potential savings, available incentives, and expected payback period
                    for your solar investment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-bold">SolarScan AI</h3>
              </div>
              <p className="text-gray-400">AI-powered rooftop analysis for solar installation potential assessment.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/installers" className="text-gray-400 hover:text-white">
                    Installers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/documentation" className="text-gray-400 hover:text-white">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="text-gray-400 hover:text-white">
                    Example Analyses
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">vishalmaurya850@gmail.com</li>
                <li className="text-gray-400">+91 9628525211</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SolarScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}