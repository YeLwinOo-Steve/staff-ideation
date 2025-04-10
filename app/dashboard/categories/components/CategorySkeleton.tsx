import { motion } from "framer-motion";

const skeletonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export function CategorySkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      className="card border bg-base-200 border-base-200 shadow-sm"
      layout
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="skeleton w-12 h-12 rounded-xl bg-base-300" />
              <div className="skeleton h-7 w-32 rounded-lg bg-base-300" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton w-8 h-8 rounded-full bg-base-300" />
              <div className="skeleton w-8 h-8 rounded-full bg-base-300" />
            </div>
          </div>

          <div className="skeleton h-[1px] w-full bg-base-300" />

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-xl p-3 bg-base-300/20">
              <div className="skeleton w-10 h-10 rounded-lg bg-base-300" />
              <div className="flex flex-col gap-2">
                <div className="skeleton h-3 w-16 bg-base-300" />
                <div className="skeleton h-4 w-32 bg-base-300" />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl p-3 bg-base-300/20">
              <div className="skeleton w-10 h-10 rounded-lg bg-base-300" />
              <div className="flex flex-col gap-2">
                <div className="skeleton h-3 w-16 bg-base-300" />
                <div className="skeleton h-4 w-32 bg-base-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
