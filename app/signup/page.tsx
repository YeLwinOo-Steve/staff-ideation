"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { signupSchema } from "@/schema/validations"
import { sleep } from "@/util/sleep"

type SignupForm = z.infer<typeof signupSchema>

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false)
    const signup = useAuthStore((state) => state.signup)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupForm) => {
        setIsLoading(true)
        try {
            await sleep(1000)
            signup(data.name, data.email, data.password)
            router.push("/dashboard")
        } catch (error) {
            console.error("Signup failed:", error)
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
                    <h1 className="text-5xl font-bold">Sign up</h1>
                    <p className="py-6">Create a staff account and join a department!</p>
                </div>
                <div className="flex-shrink-0 w-full max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="name"
                                className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                                {...register("name")}
                            />
                            {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
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
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="confirm password"
                                className={`input input-bordered ${errors.confirmPassword ? "input-error" : ""}`}
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <span className="text-error text-xs mt-1">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : `Sign Up`}
                            </button>

                        </div>
                        <div className="text-center mt-4">
                            <Link href="/login" className="link link-hover">
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

