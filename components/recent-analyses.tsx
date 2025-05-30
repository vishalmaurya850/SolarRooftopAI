import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

async function getRecentAnalyses(userId: string) {
  return await prisma.analysis.findMany({
    where: {
      property: { userId },
    },
    include: {
      property: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })
}

export async function RecentAnalyses() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Please sign in to view analyses</div>
  }

  const analyses = await getRecentAnalyses(session.user.id)

  if (analyses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analyses yet. Start by adding a property!</p>
        <Link href="/properties/new">
          <Button className="mt-4">Add Property</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">
              {analysis.property.address}, {analysis.property.city}, {analysis.property.state}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <Badge variant={analysis.status === "COMPLETED" ? "default" : "secondary"}>{analysis.status}</Badge>
              {analysis.suitabilityScore && (
                <span className="text-sm text-gray-600">Score: {analysis.suitabilityScore}/100</span>
              )}
              {analysis.potentialCapacity && (
                <span className="text-sm text-gray-600">{analysis.potentialCapacity} kW potential</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{new Date(analysis.createdAt).toLocaleDateString()}</p>
          </div>
          <Link href={`/analysis/${analysis.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
