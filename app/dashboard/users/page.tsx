"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../components/navBar";
import Image from "next/image";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useApiStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";

const Users = () => {
  const { users, fetchUsers, fetchDepartments, departments, isLoading } =
    useApiStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, [fetchUsers, fetchDepartments]);

  const getDepartmentName = (deptId: number) => {
    const department = departments.find((d) => d.id === deptId);
    return department ? department.department_name : "Unknown Department";
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(users)
    ? users.slice(indexOfFirstUser, indexOfLastUser)
    : [];
  const totalPages = Array.isArray(users)
    ? Math.ceil(users.length / usersPerPage)
    : 0;

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/dashboard/users/create")}
          >
            <PlusIcon className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <th>
                        <label>{indexOfFirstUser + index + 1}.</label>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12 bg-base-200 flex items-center justify-center relative">
                              {user.photo ? (
                                <Image
                                  src={user.photo}
                                  width={48}
                                  height={48}
                                  alt={`${user.name}'s Avatar`}
                                />
                              ) : (
                                <div className="bg-primary text-white rounded-full h-full w-full flex items-center justify-center text-xl font-bold">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-sm opacity-50">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-accent badge-sm mr-2">
                          {user.role_id === 1
                            ? "Admin"
                            : user.role_id === 2
                              ? "QA Manager"
                              : user.role_id === 3
                                ? "QA Coordinator"
                                : "Staff"}
                        </span>
                      </td>
                      <td>{getDepartmentName(user.department_id)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost btn-square"
                            onClick={() =>
                              router.push(`/dashboard/users/edit/${user.id}`)
                            }
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={5} className="text-center">
                    <div className="join">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <input
                          key={index}
                          className="join-item btn btn-square"
                          type="radio"
                          name="options"
                          aria-label={`${index + 1}`}
                          checked={currentPage === index + 1}
                          onChange={() => setCurrentPage(index + 1)}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
