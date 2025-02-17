"use client"

import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome, {user.name}!</h1>
          <p className="py-6">You have successfully logged in to your dashboard.</p>
          <button
            onClick={() => {
              logout()
              router.push("/")
            }}
            className="btn btn-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

