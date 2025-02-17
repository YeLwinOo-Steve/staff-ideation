import Link from "next/link"

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome</h1>
          <p className="py-6">EWSD Staff Ideation Website</p>
          <Link href="/login" className="btn btn-primary mr-2">
            Login
          </Link>
          <Link href="/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

