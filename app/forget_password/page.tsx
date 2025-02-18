'use client';
import { forgetPasswordSchema } from '@/schema/validations'
import { useAuthStore } from '@/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


type ForgetPasswordForm = z.infer<typeof forgetPasswordSchema>

export default function ForgetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const resetPassword = useAuthStore((state) => state.resetPassword)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgetPasswordForm>({
        resolver: zodResolver(forgetPasswordSchema),
    })

    const onSubmit = async (data: ForgetPasswordForm) => {
        setIsLoading(true)
        try {
            resetPassword(data.email)
            router.replace("/forget_password/success")
        } catch (error) {
            console.error("Reset password failed:", error)
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
                className="hero-content flex-col"
            >
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-bold">Forgot Password?</h1>
                    <p className="py-6">Enter the email address you used for sign up and we&apos;ll send you instructions to reset your password.</p>
                </div>
                <div className="w-full max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                                {...register("email")} />
                            {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                        </div>
                        <div className="text-left mt-8">
                            <Link href="/login" className="link link-hover">
                                Do you remember password? Login
                            </Link>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className={`btn btn-outline ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                                Send Password Reset
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}