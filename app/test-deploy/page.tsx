"use client"

import { useEffect, useState } from "react"

export default function TestDeployPage() {
  const [deployTime, setDeployTime] = useState<string>("")

  useEffect(() => {
    setDeployTime(new Date().toLocaleString())
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Vercel Deployment Test</h1>
      <div className="bg-green-100 p-4 rounded-lg">
        <p className="text-green-800">
          This page was deployed at: {deployTime}
        </p>
      </div>
    </div>
  )
}
