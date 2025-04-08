"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import IdeaList from "./components/ideaList";
import { useApiStore } from "@/store/apiStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const {
    fetchIdeas,
    fetchCategories,
    fetchUsers,
    categories,
    userPagination: { total: userTotal },
    ideaPagination: { total },
  } = useApiStore();
  const router = useRouter();

  useEffect(() => {
    // TODO (Ye): Remove this once persistence is implemented
    // if (!user) {
    //   router.push("/login");
    // } else {
    //   fetchIdeas({ page: "1" });
    // }
    const loadData = async () => {
      const promises = [];
      if (!userTotal) {
        promises.push(fetchUsers());
      }
      if (!total) {
        promises.push(fetchIdeas({ page: "1" }));
      }
      if (categories === null) {
        promises.push(fetchCategories());
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    };
    loadData();
  }, [
    fetchIdeas,
    fetchUsers,
    fetchCategories,
    categories,
    router,
    user,
    userTotal,
    total,
  ]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name.split(" ")[0]}!
          </h1>
          <Link
            href="/dashboard/ideas/create"
            className="btn btn-primary btn-md"
          >
            <PlusIcon className="w-4 h-4" />
            Create New Idea
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 my-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Ideas</div>
              <div className="stat-value">{total}</div>
              <div className="stat-desc">Number of ideas</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{userTotal}</div>
              <div className="stat-desc">Users in EWSD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Section */}
      <div className="mb-8 flex flex-col items-center">
        <IdeaList gridCols={3} />
      </div>

      {/* <div className="mt-8">
          <ZipDownloadBtn />
        </div> */}
    </motion.div>
  );
}
