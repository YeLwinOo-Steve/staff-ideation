"use client";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useLoginActivityStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrowserUsageChart } from "@/app/components/analytics/BrowserUsageChart";
import { UserActivityChart } from "@/app/components/analytics/UserActivityChart";
import { DepartmentStatsChart } from "@/app/components/analytics/DepartmentStatsChart";
import { CategoryStatsChart } from "@/app/components/analytics/CategoryStatsChart";
import { HiddenStatsChart } from "@/app/components/analytics/HiddenStatsChart";
import { UserLogChart } from "@/app/components/analytics/UserLogChart";

const ReportsPage = () => {
  const user = useAuthStore((state) => state.user);
  const loginActivities = useLoginActivityStore(
    (state) => state.loginActivities
  );
  const getUserLoginActivities = useLoginActivityStore(
    (state) => state.getUserLoginActivities
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
  } = useApiStore();
  const router = useRouter();

  useEffect(() => {
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
      if (departments === null) {
        promises.push(fetchDepartments());
      }
      promises.push(getActiveUsers());
      promises.push(getDepartmentReport());
      promises.push(getHiddenIdeas());
      if (user) {
        promises.push(getUserLoginActivities(user.id));
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
    fetchDepartments,
    departments,
    getActiveUsers,
    getDepartmentReport,
    getUserLoginActivities,
    getHiddenIdeas,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">{categories?.length}</div>
            <div className="stat-desc">Number of categories</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Departments</div>
            <div className="stat-value">{departments?.length}</div>
            <div className="stat-desc">Number of departments</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browser Usage Chart */}
        {loginActivities && loginActivities.length > 0 ? (
          <BrowserUsageChart loginActivities={loginActivities} />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Browser Usage</h2>
              <div className="w-full h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        )}

        {/* User Activity Chart */}
        {activeUsers && activeUsers.length > 0 ? (
          <UserActivityChart activeUsers={activeUsers} />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Top Active Users</h2>
              <div className="w-full h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        )}

        {/* Department Stats Chart */}
        {departmentReport && departmentReport.length > 0 ? (
          <DepartmentStatsChart departmentStats={departmentReport} />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Department Statistics</h2>
              <div className="w-full h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        )}

        {/* Category Stats Chart */}
        {categories && categories.length > 0 ? (
          <CategoryStatsChart categories={categories} />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Categories Distribution</h2>
              <div className="w-full h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Stats Chart */}
        {hiddenIdeas && hiddenIdeas.length > 0 ? (
          <HiddenStatsChart hiddenIdeas={hiddenIdeas} />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Hidden Content by Department</h2>
              <div className="w-full h-[300px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
