"use client"

import { LoginForm } from "@/components/login/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <LoginForm />
      </div>
    </div>
  )
}
