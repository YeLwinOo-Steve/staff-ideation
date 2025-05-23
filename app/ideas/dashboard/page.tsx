"use client";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useLoginActivityStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Meh,
  Users,
  Building2,
  Lightbulb,
  Blocks,
  ChartPie,
  ChartBar,
} from "lucide-react";
import { BrowserUsageChart } from "@/app/components/analytics/BrowserUsageChart";
import { UserActivityChart } from "@/app/components/analytics/UserActivityChart";
import { DepartmentStatsChart } from "@/app/components/analytics/DepartmentStatsChart";
import { CategoryStatsChart } from "@/app/components/analytics/CategoryStatsChart";
import { HiddenStatsChart } from "@/app/components/analytics/HiddenStatsChart";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const EmptyState = ({ title }: { title: string }) => (
  <motion.div className="card" {...fadeInUp}>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <Meh className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
              <ChartBar className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center m-2">
            No Data Available
          </h3>
          <p className="text-base-content/60 text-center max-w-sm">
            There&apos;s no data to display at the moment. Check back later for
            updates.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

const LoadingState = ({ title }: { title: string }) => (
  <motion.div className="card" {...fadeInUp}>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <div className="w-full h-[300px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </motion.div>
);

const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const loginActivities = useLoginActivityStore(
    (state) => state.loginActivities,
  );
  const getUserLoginActivities = useLoginActivityStore(
    (state) => state.getUserLoginActivities,
  );
  const {
    fetchIdeas,
    fetchCategories,
    fetchUsers,
    fetchDepartments,
    getActiveUsers,
    getDepartmentReport,
    getHiddenIdeas,
    categories,
    departments,
    userPagination: { total: userTotal },
    ideaPagination: { total },
    activeUsers,
    departmentReport,
    hiddenIdeas,
    error,
  } = useApiStore();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
      if (departments === null) {
        promises.push(fetchDepartments());
      }
      promises.push(getActiveUsers());
      promises.push(getDepartmentReport());
      promises.push(getHiddenIdeas());
      if (user) {
        promises.push(getUserLoginActivities(user.id));
      }
      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
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
    fetchDepartments,
    departments,
    getActiveUsers,
    getDepartmentReport,
    getUserLoginActivities,
    getHiddenIdeas,
  ]);

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <ChartPie className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={fadeInUp}
          className="stats bg-primary/30 text-primary-content"
        >
          <div className="stat">
            <div className="stat-figure text-primary">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary-content/80">
              Total Ideas
            </div>
            <div className="stat-value">{total || 0}</div>
            <div className="stat-desc text-primary-content/60">
              {total > 0
                ? "Ideas submitted by users"
                : "No ideas submitted yet"}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="stats bg-secondary/30 text-secondary-content"
        >
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title text-secondary-content/80">
              Total Users
            </div>
            <div className="stat-value">{userTotal || 0}</div>
            <div className="stat-desc text-secondary-content/60">
              {userTotal > 0
                ? "Active users in EWSD"
                : "No users registered yet"}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="stats bg-accent/30 text-accent-content"
        >
          <div className="stat">
            <div className="stat-figure text-accent">
              <Blocks className="w-8 h-8" />
            </div>
            <div className="stat-title text-accent-content/80">Categories</div>
            <div className="stat-value">{categories?.length || 0}</div>
            <div className="stat-desc text-accent-content/60">
              {categories?.length > 0
                ? "Available idea categories"
                : "No categories created"}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="stats bg-info/30 text-info-content"
        >
          <div className="stat">
            <div className="stat-figure text-info">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="stat-title text-info-content/80">Departments</div>
            <div className="stat-value">{departments?.length || 0}</div>
            <div className="stat-desc text-info-content/60">
              {departments?.length > 0
                ? "Active departments"
                : "No departments created"}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Browser Usage Chart */}
        <motion.div variants={fadeInUp}>
          {isLoading ? (
            <LoadingState title="Browser Usage" />
          ) : loginActivities && loginActivities.length > 0 ? (
            <BrowserUsageChart loginActivities={loginActivities} />
          ) : (
            <EmptyState title="Browser Usage" />
          )}
        </motion.div>

        {/* User Activity Chart */}
        <motion.div variants={fadeInUp}>
          {isLoading ? (
            <LoadingState title="Top Active Users" />
          ) : activeUsers && activeUsers.length > 0 ? (
            <UserActivityChart activeUsers={activeUsers} />
          ) : (
            <EmptyState title="Top Active Users" />
          )}
        </motion.div>

        {/* Department Stats Chart */}
        <motion.div variants={fadeInUp}>
          {isLoading ? (
            <LoadingState title="Department Statistics" />
          ) : departmentReport && departmentReport.length > 0 ? (
            <DepartmentStatsChart departmentStats={departmentReport} />
          ) : (
            <EmptyState title="Department Statistics" />
          )}
        </motion.div>

        {/* Category Stats Chart */}
        <motion.div variants={fadeInUp}>
          {isLoading ? (
            <LoadingState title="Categories Distribution" />
          ) : categories && categories.length > 0 ? (
            <CategoryStatsChart categories={categories} />
          ) : (
            <EmptyState title="Categories Distribution" />
          )}
        </motion.div>

        {/* Hidden Stats Chart */}
        <motion.div variants={fadeInUp}>
          {isLoading ? (
            <LoadingState title="Hidden Ideas" />
          ) : hiddenIdeas && hiddenIdeas.length > 0 ? (
            <HiddenStatsChart hiddenIdeas={hiddenIdeas} />
          ) : (
            <EmptyState title="Hidden Ideas" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
