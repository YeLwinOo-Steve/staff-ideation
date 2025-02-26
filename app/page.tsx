import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="max-w-lg text-center">
          <Image
            src="/uog-logo.svg"
            width="250"
            height="52"
            alt="University of Greenwich Logo"
            className="mb-8"
          />
          <h1 className="text-5xl font-bold">Welcome</h1>
          <p className="mt-4 mb-8">EWSD Staff Ideation Website</p>
          <div>
            <Link href="/login" className="btn btn-wide btn-primary mb-4">
              Login
            </Link>
          </div>
          <div>
            <Link href="/signup" className="btn btn-wide btn-outline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
