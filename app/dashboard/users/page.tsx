"use client";

import React, { useEffect } from "react";
import NavBar from "../components/navBar";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useApiStore } from "@/store/apiStore";
import { useRouter } from "next/navigation";

const Users = () => {
  const {
    userPagination: { data: users, currentPage, lastPage, loading },
    fetchUsers,
    fetchDepartments,
    fetchRoles,
    departments,
    roles
  } = useApiStore();

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, [fetchUsers, fetchDepartments, fetchRoles]);

  const getDepartmentName = (department: string[] | null) => {
    if (!department) return "No Department";
    if (Array.isArray(department) && department.length > 0) {
      return department.join(", ");
    }
    return "No Department";
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

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

        {loading ? (
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <th>
                        <label>{index + 1}</label>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12 bg-base-200 flex items-center justify-center relative">
                              {/* {user.photo ? (
                                <Image
                                  src={user.photo}
                                  width={48}
                                  height={48}
                                  alt={`${user.name}'s Avatar`}
                                />
                              ) : (
                                
                              )} */}
                              <div className="bg-primary text-white rounded-full h-full w-full flex items-center justify-center text-xl font-bold">
                                {user.name.charAt(0)}
                              </div>
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
                      <td>{getDepartmentName(user.department)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() =>
                              router.push(`/dashboard/users/edit/${user.id}`)
                            }
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span className="text-xs">Edit</span>
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
