"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Bug {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}

interface BugContextType {
  bugs: Bug[]
  loading: boolean
  error: string | null
  createBug: (bug: Omit<Bug, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateBug: (id: string, updates: Partial<Bug>) => Promise<void>
  deleteBug: (id: string) => Promise<void>
  debugLogs: string[]
  addDebugLog: (message: string) => void
}

const BugContext = createContext<BugContextType | undefined>(undefined)

export function BugProvider({ children }: { children: React.ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  // Debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage) // Console logging for debugging
    setDebugLogs((prev) => [...prev.slice(-9), logMessage]) // Keep last 10 logs
  }

  // Simulate API delay for testing
  const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

  // Initialize with sample data
  useEffect(() => {
    const sampleBugs: Bug[] = [
      {
        id: "1",
        title: "Login button not responding",
        description: "The login button doesn't respond when clicked on mobile devices",
        status: "open",
        priority: "high",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        title: "Dashboard loading slowly",
        description: "Dashboard takes more than 5 seconds to load user data",
        status: "in-progress",
        priority: "medium",
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: "3",
        title: "Typo in footer text",
        description: "There's a spelling mistake in the footer copyright text",
        status: "resolved",
        priority: "low",
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
    ]
    setBugs(sampleBugs)
    addDebugLog("Initialized with sample bug data")
  }, [])

  const createBug = async (bugData: Omit<Bug, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      setError(null)
      addDebugLog(`Creating bug: ${bugData.title}`)

      await simulateApiDelay()

      // Simulate validation error for testing
      if (bugData.title.length < 5) {
        throw new Error("Title must be at least 5 characters long")
      }

      const newBug: Bug = {
        ...bugData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setBugs((prev) => [newBug, ...prev])
      addDebugLog(`Successfully created bug with ID: ${newBug.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create bug"
      setError(errorMessage)
      addDebugLog(`Error creating bug: ${errorMessage}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBug = async (id: string, updates: Partial<Bug>) => {
    try {
      setLoading(true)
      setError(null)
      addDebugLog(`Updating bug ${id} with: ${JSON.stringify(updates)}`)

      await simulateApiDelay()

      setBugs((prev) => prev.map((bug) => (bug.id === id ? { ...bug, ...updates, updatedAt: new Date() } : bug)))

      addDebugLog(`Successfully updated bug ${id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update bug"
      setError(errorMessage)
      addDebugLog(`Error updating bug: ${errorMessage}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBug = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      addDebugLog(`Deleting bug ${id}`)

      await simulateApiDelay()

      setBugs((prev) => prev.filter((bug) => bug.id !== id))
      addDebugLog(`Successfully deleted bug ${id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete bug"
      setError(errorMessage)
      addDebugLog(`Error deleting bug: ${errorMessage}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <BugContext.Provider
      value={{
        bugs,
        loading,
        error,
        createBug,
        updateBug,
        deleteBug,
        debugLogs,
        addDebugLog,
      }}
    >
      {children}
    </BugContext.Provider>
  )
}

export function useBugContext() {
  const context = useContext(BugContext)
  if (context === undefined) {
    throw new Error("useBugContext must be used within a BugProvider")
  }
  return context
}
