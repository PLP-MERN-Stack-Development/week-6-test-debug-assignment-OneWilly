"use client"

import { useState } from "react"
import { useBugContext, type Bug } from "@/contexts/BugContext"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock, CheckCircle, Trash2, Calendar } from "lucide-react"

interface BugItemProps {
  bug: Bug
}

export function BugItem({ bug }: BugItemProps) {
  const { updateBug, deleteBug, addDebugLog } = useBugContext()
  const [isUpdating, setIsUpdating] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await updateBug(bug.id, { status: newStatus as Bug["status"] })
      addDebugLog(`Updated bug ${bug.id} status to ${newStatus}`)
    } catch (err) {
      addDebugLog(`Failed to update bug ${bug.id}: ${err}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this bug report?")) {
      try {
        await deleteBug(bug.id)
        addDebugLog(`Deleted bug ${bug.id}`)
      } catch (err) {
        addDebugLog(`Failed to delete bug ${bug.id}: ${err}`)
      }
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{bug.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPriorityColor(bug.priority)}>{bug.priority.toUpperCase()}</Badge>
              <Badge className={getStatusColor(bug.status)}>
                {getStatusIcon(bug.status)}
                <span className="ml-1 capitalize">{bug.status.replace("-", " ")}</span>
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {bug.createdAt.toLocaleDateString()}
              </span>
              {bug.updatedAt.getTime() !== bug.createdAt.getTime() && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Updated: {bug.updatedAt.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{bug.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={bug.status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
