"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowDownUp, RefreshCcw, AlertTriangle, CheckCircle2, XCircle, Network } from "lucide-react"

interface DataFlowMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

interface DataFlowTest {
  id: string
  name: string
  description: string
  status: "passed" | "failed" | "pending"
  duration?: number
  error?: string
}

interface DataFlowBottleneck {
  id: string
  component: string
  description: string
  severity: "low" | "medium" | "high"
  recommendation: string
}

export function DataFlowInspector() {
  const [metrics, setMetrics] = useState<DataFlowMetric[]>([])
  const [tests, setTests] = useState<DataFlowTest[]>([])
  const [bottlenecks, setBottlenecks] = useState<DataFlowBottleneck[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Run data flow analysis
  const runAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setTests((prevTests) => prevTests.map((test) => ({ ...test, status: "pending" })))

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate test completion
    setTimeout(() => {
      updateTestResults()
    }, 4000)
  }

  // Initialize with sample data
  useEffect(() => {
    // Sample metrics
    setMetrics([
      {
        id: "1",
        name: "Message Throughput",
        value: 42.5,
        unit: "msg/sec",
        status: "good",
        trend: "up",
      },
      {
        id: "2",
        name: "Average Latency",
        value: 187,
        unit: "ms",
        status: "warning",
        trend: "up",
      },
      {
        id: "3",
        name: "Memory Usage",
        value: 68,
        unit: "%",
        status: "warning",
        trend: "up",
      },
      {
        id: "4",
        name: "Event Processing",
        value: 95.2,
        unit: "%",
        status: "good",
        trend: "stable",
      },
      {
        id: "5",
        name: "Data Consistency",
        value: 99.7,
        unit: "%",
        status: "good",
        trend: "stable",
      },
    ])

    // Sample tests
    setTests([
      {
        id: "1",
        name: "Message Delivery",
        description: "Verifies that messages are delivered to the correct recipients",
        status: "pending",
      },
      {
        id: "2",
        name: "State Synchronization",
        description: "Checks if state is properly synchronized across components",
        status: "pending",
      },
      {
        id: "3",
        name: "Event Propagation",
        description: "Tests the propagation of events through the system",
        status: "pending",
      },
      {
        id: "4",
        name: "Conversation Persistence",
        description: "Verifies that conversations are properly persisted",
        status: "pending",
      },
      {
        id: "5",
        name: "Error Handling",
        description: "Tests error handling and recovery mechanisms",
        status: "pending",
      },
    ])

    // Sample bottlenecks
    setBottlenecks([
      {
        id: "1",
        component: "Message Queue",
        description: "High contention during peak message processing",
        severity: "medium",
        recommendation: "Implement message batching to reduce queue operations",
      },
      {
        id: "2",
        component: "State Management",
        description: "Excessive re-renders due to fine-grained state updates",
        severity: "high",
        recommendation: "Use memoization and optimize state update patterns",
      },
      {
        id: "3",
        component: "Event System",
        description: "Event listeners not properly cleaned up",
        severity: "medium",
        recommendation: "Ensure all event listeners are removed in useEffect cleanup functions",
      },
      {
        id: "4",
        component: "Data Synchronization",
        description: "Redundant API calls for the same data",
        severity: "low",
        recommendation: "Implement request deduplication and caching",
      },
    ])
  }, [])

  // Update test results (simulated)
  const updateTestResults = () => {
    setTests([
      {
        id: "1",
        name: "Message Delivery",
        description: "Verifies that messages are delivered to the correct recipients",
        status: "passed",
        duration: 1.2,
      },
      {
        id: "2",
        name: "State Synchronization",
        description: "Checks if state is properly synchronized across components",
        status: "warning",
        duration: 0.8,
        error: "Occasional state inconsistencies detected during rapid updates",
      },
      {
        id: "3",
        name: "Event Propagation",
        description: "Tests the propagation of events through the system",
        status: "passed",
        duration: 1.5,
      },
      {
        id: "4",
        name: "Conversation Persistence",
        description: "Verifies that conversations are properly persisted",
        status: "failed",
        duration: 2.1,
        error: "Race condition detected when multiple updates occur simultaneously",
      },
      {
        id: "5",
        name: "Error Handling",
        description: "Tests error handling and recovery mechanisms",
        status: "passed",
        duration: 0.9,
      },
    ])
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Data Flow Inspector</CardTitle>
        <Button onClick={runAnalysis} disabled={isAnalyzing} className="flex items-center gap-2">
          {isAnalyzing ? (
            <>
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Network className="h-4 w-4" />
              Analyze Data Flows
            </>
          )}
        </Button>
      </CardHeader>

      {isAnalyzing && (
        <div className="px-6 pb-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right mt-1">{progress}% complete</p>
        </div>
      )}

      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{metric.name}</h3>
                        <div className="flex items-baseline mt-1">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <span className="ml-1 text-sm text-muted-foreground">{metric.unit}</span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          metric.status === "good" ? "success" : metric.status === "warning" ? "warning" : "destructive"
                        }
                        className="flex items-center gap-1"
                      >
                        {metric.status === "good" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : metric.status === "warning" ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>{metric.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center mt-4 text-xs">
                      <ArrowDownUp
                        className={`h-3 w-3 mr-1 ${
                          metric.trend === "up"
                            ? "text-green-500 rotate-180"
                            : metric.trend === "down"
                              ? "text-red-500"
                              : "text-yellow-500 rotate-90"
                        }`}
                      />
                      <span className="text-muted-foreground">
                        {metric.trend === "up" ? "Increasing" : metric.trend === "down" ? "Decreasing" : "Stable"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            test.status === "passed" ? "success" : test.status === "failed" ? "destructive" : "outline"
                          }
                          className="flex items-center gap-1"
                        >
                          {test.status === "passed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : test.status === "failed" ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <RefreshCcw className="h-3 w-3 animate-spin" />
                          )}
                          <span>{test.status}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.duration ? `${test.duration.toFixed(1)}s` : "-"}
                        {test.error && <div className="mt-1 text-xs text-red-500">{test.error}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="bottlenecks" className="space-y-4">
            {bottlenecks.map((bottleneck) => (
              <Card key={bottleneck.id} className="mb-4">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {bottleneck.severity === "high" ? (
                        <div className="mt-1 p-1 bg-red-100 rounded-full">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                      ) : bottleneck.severity === "medium" ? (
                        <div className="mt-1 p-1 bg-yellow-100 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                      ) : (
                        <div className="mt-1 p-1 bg-blue-100 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-blue-600" />
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium">{bottleneck.component}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{bottleneck.description}</p>

                        <div className="mt-3 flex items-center">
                          <Badge
                            variant={
                              bottleneck.severity === "high"
                                ? "destructive"
                                : bottleneck.severity === "medium"
                                  ? "warning"
                                  : "outline"
                            }
                          >
                            {bottleneck.severity} severity
                          </Badge>
                        </div>

                        <div className="mt-3 bg-muted p-3 rounded-md">
                          <h4 className="text-xs font-medium mb-1">Recommendation:</h4>
                          <p className="text-sm">{bottleneck.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
