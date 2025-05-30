import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, BarChart3, DollarSign, Leaf } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

async function getStats(userId: string) {
  const [properties, analyses, financialData] = await Promise.all([
    prisma.property.count({
      where: { userId },
    }),
    prisma.analysis.findMany({
      where: {
        property: { userId },
        status: "COMPLETED",
      },
      include: {
        financialCalculations: true,
      },
    }),
    prisma.financialCalculation.aggregate({
      where: {
        analysis: {
          property: { userId },
        },
      },
      _sum: {
        annualSavings: true,
        co2Reduction: true,
      },
    }),
  ])

  const totalSavings = financialData._sum.annualSavings || 0
  const co2Reduction = financialData._sum.co2Reduction || 0

  return {
    totalProperties: properties,
    completedAnalyses: analyses.length,
    totalSavings: Math.round(totalSavings * 25), // 25-year projection
    co2Reduction: Math.round(co2Reduction * 10) / 10,
  }
}

export async function DashboardStats() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Please sign in to view stats</div>
  }

  const stats = await getStats(session.user.id)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Properties</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProperties}</div>
          <p className="text-xs text-muted-foreground">Total properties analyzed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analyses</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
          <p className="text-xs text-muted-foreground">Completed solar analyses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalSavings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">25-year projected savings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.co2Reduction}</div>
          <p className="text-xs text-muted-foreground">Tons per year</p>
        </CardContent>
      </Card>
    </>
  )
}
