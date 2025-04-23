"use client";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ReportsPage = () => {
  const user = useAuthStore((state) => state.user);
  const {
    fetchIdeas,
    fetchCategories,
    fetchUsers,
    fetchDepartments,
    categories,
    departments,
    userPagination: { total: userTotal },
    ideaPagination: { total },
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
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="mb-8">
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
      </div>
    </div>
  );
};

export default ReportsPage;
