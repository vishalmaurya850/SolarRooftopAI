import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Users, Calculator } from "lucide-react"
import { ROICalculator } from "./roi-calculator"

export function QuickActions() {
  const actions = [
    {
      title: "New Property",
      description: "Add a new property for analysis",
      icon: Plus,
      href: "/properties/new",
      variant: "default" as const,
    },
    {
      title: "Upload Image",
      description: "Upload rooftop image for existing property",
      icon: Upload,
      href: "/upload",
      variant: "outline" as const,
    },
    // {
    //   title: "View Reports",
    //   description: "Access your analysis reports",
    //   icon: FileText,
    //   href: "/reports",
    //   variant: "outline" as const,
    // },
    {
      title: "Find Installers",
      description: "Connect with solar installers",
      icon: Users,
      href: "/installers",
      variant: "outline" as const,
    },
    // {
    //   title: "ROI Calculator",
    //   description: "Calculate solar investment returns",
    //   icon: Calculator,
    //   href: "/roi-calculator",
    //   variant: "outline" as const,
    // },
  ]

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href} className="block">
          <Button variant={action.variant} className="w-full justify-start gap-3 h-auto p-4">
            <action.icon className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs opacity-70">{action.description}</div>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  )
}
