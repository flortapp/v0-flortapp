"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowRightLeft, MessageSquare, Users, Bot } from "lucide-react"

interface MessageFlowEvent {
  id: string
  timestamp: Date
  type: "send" | "receive" | "update" | "error"
  source: "user" | "bot" | "system" | "admin"
  target: "user" | "bot" | "system" | "admin"
  status: "success" | "pending" | "error"
  message: string
  metadata?: Record<string, any>
}

export function MessageFlowAnalyzer() {
  const [events, setEvents] = useState<MessageFlowEvent[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [issues, setIssues] = useState<{
    critical: string[]
    warnings: string[]
    recommendations: string[]
  }>({
    critical: [],
    warnings: [],
    recommendations: [],
  })

  // Start recording message flow events
  const startRecording = () => {
    setIsRecording(true)
    setEvents([])

    // Add initial event
    addEvent({
      type: "update",
      source: "system",
      target: "system",
      status: "success",
      message: "Message flow recording started",
    })
  }

  // Stop recording and analyze results
  const stopRecording = () => {
    setIsRecording(false)

    // Add final event
    addEvent({
      type: "update",
      source: "system",
      target: "system",
      status: "success",
      message: "Message flow recording stopped",
    })

    // Analyze the recorded events
    analyzeEvents()
  }

  // Add a new event to the recording
  const addEvent = (event: Omit<MessageFlowEvent, "id" | "timestamp">) => {
    const newEvent: MessageFlowEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...event,
    }

    setEvents((prev) => [...prev, newEvent])
  }

  // Analyze the recorded events for issues
  const analyzeEvents = () => {
    const critical: string[] = []
    const warnings: string[] = []
    const recommendations: string[] = []

    // Check for message delivery issues
    const sendEvents = events.filter((e) => e.type === "send")
    const receiveEvents = events.filter((e) => e.type === "receive")

    if (sendEvents.length > receiveEvents.length) {
      critical.push("Some sent messages were not received by their targets")
    }

    // Check for error events
    const errorEvents = events.filter((e) => e.status === "error")
    if (errorEvents.length > 0) {
      critical.push(`${errorEvents.length} error(s) detected during message transmission`)
    }

    // Check for performance issues
    const messagePairs = findMessagePairs(events)
    const delays = messagePairs.map((pair) => pair.receiveTime.getTime() - pair.sendTime.getTime())

    const avgDelay = delays.length > 0 ? delays.reduce((sum, delay) => sum + delay, 0) / delays.length : 0

    if (avgDelay > 500) {
      warnings.push(`High average message delivery delay: ${Math.round(avgDelay)}ms`)
    }

    // Check for out-of-order messages
    const outOfOrderCount = checkForOutOfOrderMessages(events)
    if (outOfOrderCount > 0) {
      warnings.push(`${outOfOrderCount} messages were processed out of order`)
    }

    // Recommendations
    if (events.length > 100) {
      recommendations.push("Consider implementing pagination or virtualization for large message volumes")
    }

    if (avgDelay > 200) {
      recommendations.push("Consider optimizing message delivery path to reduce latency")
    }

    if (errorEvents.length > 0) {
      recommendations.push("Implement robust error handling and retry mechanisms for failed message deliveries")
    }

    setIssues({ critical, warnings, recommendations })
  }

  // Find matching send/receive message pairs
  const findMessagePairs = (events: MessageFlowEvent[]) => {
    const pairs: Array<{ sendTime: Date; receiveTime: Date; message: string }> = []

    const sendEvents = events.filter((e) => e.type === "send")

    for (const sendEvent of sendEvents) {
      const matchingReceiveEvent = events.find(
        (e) =>
          e.type === "receive" &&
          e.source === sendEvent.target &&
          e.target === sendEvent.source &&
          e.message === sendEvent.message &&
          e.timestamp > sendEvent.timestamp,
      )

      if (matchingReceiveEvent) {
        pairs.push({
          sendTime: sendEvent.timestamp,
          receiveTime: matchingReceiveEvent.timestamp,
          message: sendEvent.message,
        })
      }
    }

    return pairs
  }

  // Check for out-of-order message processing
  const checkForOutOfOrderMessages = (events: MessageFlowEvent[]) => {
    let outOfOrderCount = 0

    // Group events by conversation (source-target pair)
    const conversationEvents: Record<string, MessageFlowEvent[]> = {}

    for (const event of events) {
      const conversationKey = `${event.source}-${event.target}`
      if (!conversationEvents[conversationKey]) {
        conversationEvents[conversationKey] = []
      }
      conversationEvents[conversationKey].push(event)
    }

    // Check each conversation for out-of-order events
    for (const conversation of Object.values(conversationEvents)) {
      const sortedEvents = [...conversation].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      for (let i = 0; i < conversation.length; i++) {
        if (conversation[i].id !== sortedEvents[i].id) {
          outOfOrderCount++
        }
      }
    }

    return outOfOrderCount
  }

  // Listen for message events when recording is active
  useEffect(() => {
    if (!isRecording) return

    const handleMessageSend = (event: CustomEvent) => {
      addEvent({
        type: "send",
        source: event.detail.source,
        target: event.detail.target,
        status: "success",
        message: event.detail.content,
        metadata: event.detail.metadata,
      })
    }

    const handleMessageReceive = (event: CustomEvent) => {
      addEvent({
        type: "receive",
        source: event.detail.source,
        target: event.detail.target,
        status: "success",
        message: event.detail.content,
        metadata: event.detail.metadata,
      })
    }

    const handleMessageError = (event: CustomEvent) => {
      addEvent({
        type: "error",
        source: event.detail.source,
        target: event.detail.target,
        status: "error",
        message: event.detail.error,
        metadata: event.detail.metadata,
      })
    }

    window.addEventListener("messageSend", handleMessageSend as EventListener)
    window.addEventListener("messageReceive", handleMessageReceive as EventListener)
    window.addEventListener("messageError", handleMessageError as EventListener)

    return () => {
      window.removeEventListener("messageSend", handleMessageSend as EventListener)
      window.removeEventListener("messageReceive", handleMessageReceive as EventListener)
      window.removeEventListener("messageError", handleMessageError as EventListener)
    }
  }, [isRecording])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Message Flow Analyzer</CardTitle>
        <div className="flex gap-2">
          {isRecording ? (
            <Button variant="destructive" onClick={stopRecording}>
              Stop Recording
            </Button>
          ) : (
            <Button variant="default" onClick={startRecording}>
              Start Recording
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events">
          <TabsList className="mb-4">
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="issues">
              Issues{" "}
              {issues.critical.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {issues.critical.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={event.type === "error" ? "destructive" : "outline"}>{event.type}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>{event.source}</span>
                          <ArrowRightLeft className="h-3 w-3 mx-1" />
                          <span>{event.target}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            event.status === "success"
                              ? "success"
                              : event.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{event.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {issues.critical.length === 0 && issues.warnings.length === 0 && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">No issues detected</AlertTitle>
                <AlertDescription className="text-green-700">
                  The message flow analysis did not detect any issues.
                </AlertDescription>
              </Alert>
            )}

            {issues.critical.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Critical Issues</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {issues.critical.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {issues.warnings.length > 0 && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {issues.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {issues.recommendations.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Recommendations</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {issues.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Total Messages</span>
                      <span className="text-2xl font-bold">
                        {events.filter((e) => e.type === "send" || e.type === "receive").length}
                      </span>
                    </div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">User Interactions</span>
                      <span className="text-2xl font-bold">
                        {events.filter((e) => e.source === "user" || e.target === "user").length}
                      </span>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Bot Interactions</span>
                      <span className="text-2xl font-bold">
                        {events.filter((e) => e.source === "bot" || e.target === "bot").length}
                      </span>
                    </div>
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Message Flow Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Response Time:</span>
                    <span className="font-medium">
                      {(() => {
                        const pairs = findMessagePairs(events)
                        const delays = pairs.map((pair) => pair.receiveTime.getTime() - pair.sendTime.getTime())
                        const avg =
                          delays.length > 0 ? delays.reduce((sum, delay) => sum + delay, 0) / delays.length : 0
                        return `${Math.round(avg)} ms`
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Message Delivery Rate:</span>
                    <span className="font-medium">
                      {(() => {
                        const sendCount = events.filter((e) => e.type === "send").length
                        const receiveCount = events.filter((e) => e.type === "receive").length
                        return sendCount > 0 ? `${Math.round((receiveCount / sendCount) * 100)}%` : "N/A"
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Error Rate:</span>
                    <span className="font-medium">
                      {(() => {
                        const totalEvents = events.length
                        const errorCount = events.filter((e) => e.status === "error").length
                        return totalEvents > 0 ? `${Math.round((errorCount / totalEvents) * 100)}%` : "0%"
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
