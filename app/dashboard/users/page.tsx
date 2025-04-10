"use client";

import React, { useEffect } from "react";
import { PencilIcon, PlusIcon, Users } from "lucide-react";
import { useApiStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { motion } from "framer-motion";

const UsersPage = () => {
  const { user: authUser } = useAuthStore();
  const {
    userPagination: { data: users, currentPage, lastPage, loading, total },
    fetchUsers,
    fetchDepartments,
    fetchRoles,
  } = useApiStore();

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, [fetchUsers, fetchDepartments, fetchRoles]);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="p-6 min-h-screen pb-24 relative mx-auto max-w-7xl space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Users </h1>
          <span className="badge badge-outline badge-lg">{total}</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/dashboard/users/create")}
        >
          <PlusIcon className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={tableVariants}
              initial="hidden"
              animate="show"
            >
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    custom={index}
                  >
                    <th>
                      <label>{index + 1}</label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12 bg-base-200 flex items-center justify-center relative">
                            {user.photo &&
                            user.photo?.includes("cloudinary") ? (
                              <Image
                                src={user.photo}
                                width={48}
                                height={48}
                                alt={`${user.name}'s Avatar`}
                              />
                            ) : (
                              <div className="bg-primary text-white mask mask-squircle h-full w-full flex items-center justify-center text-xl font-bold">
                                {user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-sm opacity-50">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.roles.length > 0 ? (
                        user.roles.map((role, i) => (
                          <span
                            key={i}
                            className="badge badge-accent badge-sm mr-2"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-neutral badge-sm">
                          Staff
                        </span>
                      )}
                    </td>
                    <td>
                      {user.department && user.department.length > 0
                        ? user.department
                        : "No Department"}
                    </td>
                    <td>
                      <div
                        className={`flex gap-2 ${authUser?.id === user.id || authUser?.roles.includes("admin") ? "hidden" : ""}`}
                      >
                        <button
                          className="btn btn-sm btn-primary/10 hover:bg-primary border-0"
                          onClick={() =>
                            router.push(`/dashboard/users/edit/${user.id}`)
                          }
                        >
                          <PencilIcon className="w-4 h-4" />
                          <span className="text-xs">Edit</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      )}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="join bg-base-100">
          {Array.from({ length: lastPage }).map((_, index) => (
            <input
              key={index}
              className="join-item btn btn-square"
              type="radio"
              name="options"
              aria-label={`${index + 1}`}
              checked={currentPage === index + 1}
              onChange={() => handlePageChange(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
