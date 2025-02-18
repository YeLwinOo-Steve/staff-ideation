"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { loginSchema } from "@/schema/validations"


type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        try {
            login(data.email, data.password)
            router.push("/dashboard")
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hero-content flex-col lg:flex-row-reverse"
            >
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login</h1>
                    <p className="py-6">Login to your account to propose your ideas to admins.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                                {...register("email")}
                            />
                            {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className={`input input-bordered ${errors.password ? "input-error" : ""}`}
                                {...register("password")}
                            />
                            {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                            <label className="label">
                                <Link href="/forget_password" className="label-text-alt link link-hover">
                                    Forgot password?
                                </Link>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                                Login
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <Link href="/signup" className="link link-hover">
                                Don&apos;t have an account? Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

