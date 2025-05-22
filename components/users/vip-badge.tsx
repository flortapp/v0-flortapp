// Create a new file for VipBadge component
"use client"

import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"

interface VipBadgeProps {
  user: User
  showPlan?: boolean
}

export function VipBadge({ user, showPlan = false }: VipBadgeProps) {
  // Get VIP plan name
  const getVipPlanName = (plan?: string) => {
    if (!plan) return "Vip Aylık" // Default to "Vip Aylık" if no plan is specified

    // Map plan names to display names
    switch (plan.toLowerCase()) {
      case "monthly":
      case "aylık premium":
        return "Vip Aylık"
      case "yearly":
      case "yıllık premium":
        return "Vip Yıllık"
      default:
        return plan
    }
  }

  return (
    <Badge variant="default" className="bg-amber-500">
      {showPlan ? getVipPlanName(user.vipPlan) : "VIP"}
    </Badge>
  )
}
