"use client"

import type React from "react"

import { useState } from "react"
import { useBugContext } from "@/contexts/BugContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send } from "lucide-react"

export function BugForm() {
  const { createBug, loading, error, addDebugLog } = useBugContext()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    } else if (formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    addDebugLog("Form submission started")

    if (!validateForm()) {
      addDebugLog("Form validation failed")
      return
    }

    try {
      await createBug({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: "open",
      })

      // Reset form on success
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      })
      setValidationErrors({})
      addDebugLog("Form submitted successfully and reset")
    } catch (err) {
      addDebugLog(`Form submission failed: ${err}`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Bug Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Brief description of the bug"
          className={validationErrors.title ? "border-red-500" : ""}
        />
        {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior"
          rows={4}
          className={validationErrors.description ? "border-red-500" : ""}
        />
        {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value: "low" | "medium" | "high") => handleInputChange("priority", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Report Bug
          </>
        )}
      </Button>
    </form>
  )
}
