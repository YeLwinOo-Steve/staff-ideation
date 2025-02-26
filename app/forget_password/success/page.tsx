"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React from "react";

const ForgetPasswordSuccessPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return null;
  }
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello, {user.name}!</h1>
          <p className="py-6">
            Password reset link is successfully sent to your email address!
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn btn-primary"
          >
            Go back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordSuccessPage;
