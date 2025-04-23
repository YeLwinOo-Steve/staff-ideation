"use client";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useLoginActivityStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Meh } from "lucide-react";
import { BrowserUsageChart } from "@/app/components/analytics/BrowserUsageChart";
import { UserActivityChart } from "@/app/components/analytics/UserActivityChart";
import { DepartmentStatsChart } from "@/app/components/analytics/DepartmentStatsChart";
import { CategoryStatsChart } from "@/app/components/analytics/CategoryStatsChart";
import { HiddenStatsChart } from "@/app/components/analytics/HiddenStatsChart";

const EmptyState = ({ title }: { title: string }) => (
  <div className="card">
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Meh className="h-12 w-12 mx-auto mb-4" />
          <p>No data available!</p>
        </div>
      </div>
    </div>
  </div>
);

const LoadingState = ({ title }: { title: string }) => (
  <div className="card">
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <div className="w-full h-[300px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div>
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Ideas</div>
            <div className="stat-value">{total || 0}</div>
            <div className="stat-desc">Number of ideas</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{userTotal || 0}</div>
            <div className="stat-desc">Users in EWSD</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">{categories?.length || 0}</div>
            <div className="stat-desc">Number of categories</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Departments</div>
            <div className="stat-value">{departments?.length || 0}</div>
            <div className="stat-desc">Number of departments</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browser Usage Chart */}
        {isLoading ? (
          <LoadingState title="Browser Usage" />
        ) : loginActivities && loginActivities.length > 0 ? (
          <BrowserUsageChart loginActivities={loginActivities} />
        ) : (
          <EmptyState title="Browser Usage" />
        )}

        {/* User Activity Chart */}
        {isLoading ? (
          <LoadingState title="Top Active Users" />
        ) : activeUsers && activeUsers.length > 0 ? (
          <UserActivityChart activeUsers={activeUsers} />
        ) : (
          <EmptyState title="Top Active Users" />
        )}

        {/* Department Stats Chart */}
        {isLoading ? (
          <LoadingState title="Department Statistics" />
        ) : departmentReport && departmentReport.length > 0 ? (
          <DepartmentStatsChart departmentStats={departmentReport} />
        ) : (
          <EmptyState title="Department Statistics" />
        )}

        {/* Category Stats Chart */}
        {isLoading ? (
          <LoadingState title="Categories Distribution" />
        ) : categories && categories.length > 0 ? (
          <CategoryStatsChart categories={categories} />
        ) : (
          <EmptyState title="Categories Distribution" />
        )}

        {/* Hidden Stats Chart */}
        {isLoading ? (
          <LoadingState title="Hidden Content by Department" />
        ) : hiddenIdeas && hiddenIdeas.length > 0 ? (
          <HiddenStatsChart hiddenIdeas={hiddenIdeas} />
        ) : (
          <EmptyState title="Hidden Content by Department" />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
