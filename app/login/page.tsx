"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/schema/validations";
import { useToast } from "@/components/toast";

type LoginForm = z.infer<typeof loginSchema>;

const formVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Login() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
      showSuccessToast("Login successful");
    } catch (e) {
      console.log(e);
      showErrorToast(error || "Login failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="hero-content flex-col lg:flex-row-reverse"
      >
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">
            Login to your account to propose your ideas to admins.
          </p>
        </div>
        <div className="flex-shrink-0 w-full max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className={`input input-bordered ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <span className="text-error text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  `Login`
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
