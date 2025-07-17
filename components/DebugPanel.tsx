"use client"

import { useBugContext } from "@/contexts/BugContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Terminal, Trash2, Download } from "lucide-react"

export function DebugPanel() {
  const { bugs, debugLogs, addDebugLog } = useBugContext()

  const clearLogs = () => {
    addDebugLog("Debug logs cleared")
    // Note: In a real implementation, you'd have a clearDebugLogs function
  }

  const exportLogs = () => {
    const logsText = debugLogs.join("\n")
    const blob = new Blob([logsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `debug-logs-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addDebugLog("Debug logs exported")
  }

  const triggerTestError = () => {
    addDebugLog("Triggering test error for debugging")
    throw new Error("This is a test error for debugging purposes")
  }

  return (
    <Card className="bg-gray-900 text-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-400" />
            <CardTitle className="text-green-400">Debug Panel</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-900 text-blue-200">
              {bugs.length} bugs
            </Badge>
            <Badge variant="outline" className="bg-green-900 text-green-200">
              {debugLogs.length} logs
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Real-time debugging information and application state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogs}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <Download className="h-3 w-3 mr-1" />
            Export Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerTestError}
            className="bg-red-900 border-red-600 text-red-200 hover:bg-red-800"
          >
            Test Error Boundary
          </Button>
        </div>

        {/* Application State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-blue-400 mb-2">Bug Status</h4>
            <div className="space-y-1 text-sm">
              <div>Open: {bugs.filter((b) => b.status === "open").length}</div>
              <div>In Progress: {bugs.filter((b) => b.status === "in-progress").length}</div>
              <div>Resolved: {bugs.filter((b) => b.status === "resolved").length}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-yellow-400 mb-2">Priority</h4>
            <div className="space-y-1 text-sm">
              <div>High: {bugs.filter((b) => b.priority === "high").length}</div>
              <div>Medium: {bugs.filter((b) => b.priority === "medium").length}</div>
              <div>Low: {bugs.filter((b) => b.priority === "low").length}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-green-400 mb-2">System Info</h4>
            <div className="space-y-1 text-sm">
              <div>Environment: {process.env.NODE_ENV || "development"}</div>
              <div>Timestamp: {new Date().toLocaleTimeString()}</div>
              <div>User Agent: {typeof window !== "undefined" ? window.navigator.userAgent.split(" ")[0] : "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-gray-800 p-3 rounded">
          <h4 className="font-semibold text-purple-400 mb-2">Recent Debug Logs</h4>
          <div className="bg-black p-2 rounded text-xs font-mono max-h-40 overflow-y-auto">
            {debugLogs.length === 0 ? (
              <div className="text-gray-500">No debug logs yet...</div>
            ) : (
              debugLogs.slice(-10).map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
