"use client"

import { useBugContext } from "@/contexts/BugContext"
import { BugItem } from "@/components/BugItem"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Bug } from "lucide-react"

interface BugListProps {
  filter: "all" | "open" | "in-progress" | "resolved"
}

export function BugList({ filter }: BugListProps) {
  const { bugs, loading, error } = useBugContext()

  const filteredBugs = filter === "all" ? bugs : bugs.filter((bug) => bug.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading bugs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (filteredBugs.length === 0) {
    return (
      <div className="text-center py-8">
        <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          {filter === "all" ? "No bugs reported yet" : `No ${filter.replace("-", " ")} bugs found`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredBugs.map((bug) => (
        <BugItem key={bug.id} bug={bug} />
      ))}
    </div>
  )
}
