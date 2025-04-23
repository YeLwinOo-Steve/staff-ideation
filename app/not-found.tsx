"use client";

import { motion } from "framer-motion";
import { FileQuestion, Lightbulb, MoveLeft } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="relative inline-block my-8"
        >
          <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
          <div className="relative bg-primary/10 p-16 rounded-full">
            <FileQuestion className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-5xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
        </motion.div>

        <motion.p variants={itemVariants} className="text-base-content/70">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/ideas" className="btn btn-primary gap-2 min-w-[200px]">
            <Lightbulb className="w-4 h-4" />
            Back to Ideas
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 justify-center text-sm text-base-content/50"
        >
          <MoveLeft className="w-4 h-4" />
          <span>
            You can also use the back button to return to the previous page
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
