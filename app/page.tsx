"use client"

import { useState } from "react"
import { BugProvider } from "@/contexts/BugContext"
import { BugForm } from "@/components/BugForm"
import { BugList } from "@/components/BugList"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { DebugPanel } from "@/components/DebugPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bug, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function BugTracker() {
  const [debugMode, setDebugMode] = useState(false)

  return (
    <ErrorBoundary>
      <BugProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Bug className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bug Tracker</h1>
                    <p className="text-gray-600">Track, manage, and resolve bugs efficiently</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Testing Enabled
                  </Badge>
                  <button
                    onClick={() => setDebugMode(!debugMode)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    {debugMode ? "Hide Debug" : "Show Debug"}
                  </button>
                </div>
              </div>
            </div>

            {/* Debug Panel */}
            {debugMode && (
              <div className="mb-6">
                <DebugPanel />
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bug Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Report New Bug
                    </CardTitle>
                    <CardDescription>Submit a detailed bug report to help us improve the application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BugForm />
                  </CardContent>
                </Card>
              </div>

              {/* Bug List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Bug Reports
                    </CardTitle>
                    <CardDescription>View and manage all reported bugs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="open">Open</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        <BugList filter="all" />
                      </TabsContent>
                      <TabsContent value="open" className="mt-4">
                        <BugList filter="open" />
                      </TabsContent>
                      <TabsContent value="in-progress" className="mt-4">
                        <BugList filter="in-progress" />
                      </TabsContent>
                      <TabsContent value="resolved" className="mt-4">
                        <BugList filter="resolved" />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </BugProvider>
    </ErrorBoundary>
  )
}
