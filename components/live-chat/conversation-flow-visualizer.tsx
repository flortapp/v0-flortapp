"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, User, Bot, Server, Database, RefreshCcw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

interface FlowNode {
  id: string
  type: "user" | "bot" | "server" | "database" | "event"
  label: string
  status: "active" | "idle" | "error"
}

interface FlowConnection {
  id: string
  source: string
  target: string
  label: string
  status: "active" | "slow" | "error"
  latency?: number
}

interface FlowEvent {
  id: string
  timestamp: Date
  description: string
  sourceId: string
  targetId: string
  status: "success" | "warning" | "error"
}

export function ConversationFlowVisualizer() {
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [connections, setConnections] = useState<FlowConnection[]>([])
  const [events, setEvents] = useState<FlowEvent[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeTab, setActiveTab] = useState("diagram")

  // Initialize with sample data
  useEffect(() => {
    // Sample nodes
    setNodes([
      { id: "user1", type: "user", label: "User", status: "idle" },
      { id: "ui", type: "server", label: "UI Component", status: "active" },
      { id: "event", type: "event", label: "Event System", status: "active" },
      { id: "service", type: "server", label: "Conversation Service", status: "active" },
      { id: "db", type: "database", label: "State Store", status: "active" },
      { id: "bot1", type: "bot", label: "Bot", status: "idle" },
    ])

    // Sample connections
    setConnections([
      { id: "c1", source: "user1", target: "ui", label: "User Input", status: "active" },
      { id: "c2", source: "ui", target: "event", label: "Event Dispatch", status: "active" },
      { id: "c3", source: "event", target: "service", label: "Event Handler", status: "active" },
      { id: "c4", source: "service", target: "db", label: "State Update", status: "active" },
      { id: "c5", source: "db", target: "service", label: "State Query", status: "active" },
      { id: "c6", source: "service", target: "bot1", label: "Message Delivery", status: "active" },
      { id: "c7", source: "bot1", target: "service", label: "Bot Response", status: "active" },
      { id: "c8", source: "service", target: "ui", label: "UI Update", status: "active" },
    ])

    // Sample events
    setEvents([
      {
        id: "e1",
        timestamp: new Date(Date.now() - 5000),
        description: "User sends message",
        sourceId: "user1",
        targetId: "ui",
        status: "success",
      },
      {
        id: "e2",
        timestamp: new Date(Date.now() - 4800),
        description: "UI dispatches message event",
        sourceId: "ui",
        targetId: "event",
        status: "success",
      },
      {
        id: "e3",
        timestamp: new Date(Date.now() - 4600),
        description: "Event system notifies service",
        sourceId: "event",
        targetId: "service",
        status: "success",
      },
      {
        id: "e4",
        timestamp: new Date(Date.now() - 4400),
        description: "Service updates conversation state",
        sourceId: "service",
        targetId: "db",
        status: "success",
      },
      {
        id: "e5",
        timestamp: new Date(Date.now() - 4200),
        description: "Service delivers message to bot",
        sourceId: "service",
        targetId: "bot1",
        status: "warning",
      },
    ])
  }, [])

  // Simulate conversation flow
  const simulateConversationFlow = () => {
    setIsSimulating(true)

    // Reset node statuses
    setNodes((prev) => prev.map((node) => ({ ...node, status: "idle" })))

    // Reset connection statuses
    setConnections((prev) => prev.map((conn) => ({ ...conn, status: "active" })))

    // Clear previous events
    setEvents([])

    // Simulate user sending a message
    setTimeout(() => {
      // Activate user node
      setNodes((prev) => prev.map((node) => (node.id === "user1" ? { ...node, status: "active" } : node)))

      // Add event
      addEvent({
        description: "User sends message",
        sourceId: "user1",
        targetId: "ui",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c1")
    }, 500)

    // Simulate UI processing
    setTimeout(() => {
      // Activate UI node
      setNodes((prev) => prev.map((node) => (node.id === "ui" ? { ...node, status: "active" } : node)))

      // Add event
      addEvent({
        description: "UI dispatches message event",
        sourceId: "ui",
        targetId: "event",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c2")
    }, 1500)

    // Simulate event system
    setTimeout(() => {
      // Activate event node
      setNodes((prev) => prev.map((node) => (node.id === "event" ? { ...node, status: "active" } : node)))

      // Add event
      addEvent({
        description: "Event system notifies service",
        sourceId: "event",
        targetId: "service",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c3")
    }, 2500)

    // Simulate service processing
    setTimeout(() => {
      // Activate service node
      setNodes((prev) => prev.map((node) => (node.id === "service" ? { ...node, status: "active" } : node)))

      // Add event
      addEvent({
        description: "Service updates conversation state",
        sourceId: "service",
        targetId: "db",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c4")
    }, 3500)

    // Simulate database operation
    setTimeout(() => {
      // Activate database node
      setNodes((prev) => prev.map((node) => (node.id === "db" ? { ...node, status: "active" } : node)))

      // Add event
      addEvent({
        description: "Database persists conversation",
        sourceId: "db",
        targetId: "service",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c5")
    }, 4500)

    // Simulate message delivery to bot
    setTimeout(() => {
      // Add event
      addEvent({
        description: "Service delivers message to bot",
        sourceId: "service",
        targetId: "bot1",
        status: "warning",
      })

      // Highlight connection with warning
      setConnections((prev) =>
        prev.map((conn) => (conn.id === "c6" ? { ...conn, status: "slow", latency: 350 } : conn)),
      )
    }, 5500)

    // Simulate bot processing delay
    setTimeout(() => {
      // Activate bot node
      setNodes((prev) => prev.map((node) => (node.id === "bot1" ? { ...node, status: "active" } : node)))
    }, 6500)

    // Simulate bot response
    setTimeout(() => {
      // Add event
      addEvent({
        description: "Bot sends response",
        sourceId: "bot1",
        targetId: "service",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c7")
    }, 7500)

    // Simulate service processing response
    setTimeout(() => {
      // Add event
      addEvent({
        description: "Service processes bot response",
        sourceId: "service",
        targetId: "ui",
        status: "success",
      })

      // Highlight connection
      highlightConnection("c8")
    }, 8500)

    // Simulate UI update
    setTimeout(() => {
      // Add event
      addEvent({
        description: "UI displays bot response to user",
        sourceId: "ui",
        targetId: "user1",
        status: "success",
      })

      // End simulation
      setIsSimulating(false)
    }, 9500)
  }

  // Add a new event
  const addEvent = (event: Omit<FlowEvent, "id" | "timestamp">) => {
    const newEvent: FlowEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...event,
    }

    setEvents((prev) => [...prev, newEvent])
  }

  // Highlight a connection
  const highlightConnection = (connectionId: string) => {
    setConnections((prev) => prev.map((conn) => (conn.id === connectionId ? { ...conn, status: "active" } : conn)))
  }

  // Get node icon based on type
  const getNodeIcon = (type: FlowNode["type"]) => {
    switch (type) {
      case "user":
        return <User className="h-5 w-5" />
      case "bot":
        return <Bot className="h-5 w-5" />
      case "server":
        return <Server className="h-5 w-5" />
      case "database":
        return <Database className="h-5 w-5" />
      case "event":
        return <RefreshCcw className="h-5 w-5" />
      default:
        return null
    }
  }

  // Get status badge for events
  const getStatusBadge = (status: FlowEvent["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Success</span>
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Warning</span>
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Error</span>
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conversation Flow Visualizer</CardTitle>
        <Button onClick={simulateConversationFlow} disabled={isSimulating} className="flex items-center gap-2">
          {isSimulating ? (
            <>
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <RefreshCcw className="h-4 w-4" />
              Simulate Flow
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="diagram">Flow Diagram</TabsTrigger>
            <TabsTrigger value="events">Events Log</TabsTrigger>
            <TabsTrigger value="metrics">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="min-h-[400px]">
            <div className="border rounded-md p-4 bg-gray-50 min-h-[400px] relative">
              {/* Simple flow diagram visualization */}
              <div className="flex flex-col items-center space-y-8">
                {/* User and UI layer */}
                <div className="flex w-full justify-center space-x-16">
                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "user1")?.status === "active"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">User</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "ui")?.status === "active"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">UI Component</span>
                    </div>
                  </div>
                </div>

                {/* Connection arrows */}
                <div className="flex w-full justify-center space-x-4">
                  <div className="flex items-center">
                    <div
                      className={`h-0.5 w-16 ${
                        connections.find((c) => c.id === "c1")?.status === "active" ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <ArrowRight
                      className={`h-4 w-4 ${
                        connections.find((c) => c.id === "c1")?.status === "active" ? "text-blue-500" : "text-gray-300"
                      }`}
                    />
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-0.5 w-16 ${
                        connections.find((c) => c.id === "c8")?.status === "active" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <ArrowRight
                      className={`h-4 w-4 rotate-180 ${
                        connections.find((c) => c.id === "c8")?.status === "active" ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Middle layer */}
                <div className="flex w-full justify-center space-x-8">
                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "event")?.status === "active"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RefreshCcw className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Event System</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "service")?.status === "active"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-indigo-500" />
                      <span className="font-medium">Conversation Service</span>
                    </div>
                  </div>
                </div>

                {/* Connection arrows */}
                <div className="flex w-full justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <div
                        className={`h-0.5 w-16 ${
                          connections.find((c) => c.id === "c4")?.status === "active" ? "bg-indigo-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <ArrowRight
                        className={`h-4 w-4 ${
                          connections.find((c) => c.id === "c4")?.status === "active"
                            ? "text-indigo-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <div className="flex items-center mt-2">
                      <div
                        className={`h-0.5 w-16 ${
                          connections.find((c) => c.id === "c5")?.status === "active" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <ArrowRight
                        className={`h-4 w-4 rotate-180 ${
                          connections.find((c) => c.id === "c5")?.status === "active"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom layer */}
                <div className="flex w-full justify-center space-x-16">
                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "db")?.status === "active"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">State Store</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-md border-2 ${
                      nodes.find((n) => n.id === "bot1")?.status === "active"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Bot</span>
                    </div>
                  </div>
                </div>

                {/* Connection arrows */}
                <div className="absolute right-1/4 top-1/2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <div
                        className={`h-0.5 w-16 ${
                          connections.find((c) => c.id === "c6")?.status === "slow"
                            ? "bg-yellow-500"
                            : connections.find((c) => c.id === "c6")?.status === "active"
                              ? "bg-indigo-500"
                              : "bg-gray-300"
                        }`}
                      ></div>
                      <ArrowRight
                        className={`h-4 w-4 ${
                          connections.find((c) => c.id === "c6")?.status === "slow"
                            ? "text-yellow-500"
                            : connections.find((c) => c.id === "c6")?.status === "active"
                              ? "text-indigo-500"
                              : "text-gray-300"
                        }`}
                      />
                    </div>

                    {connections.find((c) => c.id === "c6")?.status === "slow" && (
                      <Badge variant="warning" className="mt-1">
                        {connections.find((c) => c.id === "c6")?.latency}ms
                      </Badge>
                    )}

                    <div className="flex items-center mt-2">
                      <div
                        className={`h-0.5 w-16 ${
                          connections.find((c) => c.id === "c7")?.status === "active" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <ArrowRight
                        className={`h-4 w-4 rotate-180 ${
                          connections.find((c) => c.id === "c7")?.status === "active"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="min-h-[400px]">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{event.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>{event.sourceId}</span>
                          <ArrowRight className="h-3 w-3 mx-1" />
                          <span>{event.targetId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(event.status)}</td>
                    </tr>
                  ))}

                  {events.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No events recorded. Click "Simulate Flow" to generate events.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Message Delivery Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end space-x-2">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-sm h-[150px] relative">
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 rounded-sm"
                          style={{ height: "30%" }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">User → UI</span>
                      <span className="text-xs text-muted-foreground">45ms</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-sm h-[150px] relative">
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 rounded-sm"
                          style={{ height: "40%" }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">UI → Event</span>
                      <span className="text-xs text-muted-foreground">60ms</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-sm h-[150px] relative">
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 rounded-sm"
                          style={{ height: "50%" }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">Event → Service</span>
                      <span className="text-xs text-muted-foreground">75ms</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-sm h-[150px] relative">
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 rounded-sm"
                          style={{ height: "80%" }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">Service → DB</span>
                      <span className="text-xs text-muted-foreground">120ms</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-sm h-[150px] relative">
                        <div
                          className="absolute bottom-0 w-full bg-yellow-500 rounded-sm"
                          style={{ height: "100%" }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1">Service → Bot</span>
                      <span className="text-xs text-muted-foreground">350ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Component Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">UI Component</span>
                        <span className="text-xs font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Event System</span>
                        <span className="text-xs font-medium">95%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Conversation Service</span>
                        <span className="text-xs font-medium">88%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">State Store</span>
                        <span className="text-xs font-medium">78%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Bot Response</span>
                        <span className="text-xs font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
