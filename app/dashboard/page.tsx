import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LiveDashboardStats } from "@/components/live-dashboard-stats"
import { LiveRecentAnalyses } from "@/components/live-recent-analyses"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your solar analyses.</p>
          </div>
          <Link href="/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Suspense fallback={<div>Loading stats...</div>}>
            <LiveDashboardStats />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your latest rooftop solar potential assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading analyses...</div>}>
                  <LiveRecentAnalyses />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}