"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Upload } from "lucide-react";
import Image from "next/image";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";
import NavBar from "../../components/navBar";

type UserFormValues = z.infer<typeof userFormSchema>;

const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const CreateUser = () => {
  const {
    createUser,
    isLoading,
    departments,
    roles,
    fetchDepartments,
    fetchRoles,
  } = useApiStore();

  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [updatePermissions, setUpdatePermissions] = useState(false);
  const [updateRoles, setUpdateRoles] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, [fetchDepartments, fetchRoles]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role_ids: [],
      department_ids: [],
      permission_ids: [],
    },
  });

  const selectedRoles = watch("role_ids");
  const selectedPermissions = watch("permission_ids");

  useEffect(() => {
    if (!roles.length || !updatePermissions) return;

    const permissionIds: string[] = [];
    const roleIds = selectedRoles || [];

    roles.forEach((role) => {
      if (roleIds.includes(role.id.toString())) {
        role.permissions.forEach((permission) => {
          if (!permissionIds.includes(permission.id.toString())) {
            permissionIds.push(permission.id.toString());
          }
        });
      }
    });

    if (
      !arraysEqual(permissionIds.sort(), (selectedPermissions || []).sort())
    ) {
      setValue("permission_ids", permissionIds);
    }

    setUpdatePermissions(false);
  }, [selectedRoles, roles, setValue, selectedPermissions, updatePermissions]);

  useEffect(() => {
    if (!roles.length || !updateRoles) return;

    const permissionIds = selectedPermissions || [];
    const roleIds = [...(selectedRoles || [])];
    const rolesToAdd: string[] = [];
    const rolesToRemove: string[] = [];

    const permissionToRolesMap = new Map<string, string[]>();

    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        const permId = permission.id.toString();
        if (!permissionToRolesMap.has(permId)) {
          permissionToRolesMap.set(permId, []);
        }
        permissionToRolesMap.get(permId)!.push(role.id.toString());
      });
    });

    permissionIds.forEach((permId) => {
      const rolesWithThisPermission = permissionToRolesMap.get(permId) || [];

      if (rolesWithThisPermission.length > 0) {
        const alreadyHasSelectedRole = rolesWithThisPermission.some((roleId) =>
          roleIds.includes(roleId)
        );

        if (!alreadyHasSelectedRole) {
          const lastRoleId =
            rolesWithThisPermission[rolesWithThisPermission.length - 1];
          if (!rolesToAdd.includes(lastRoleId)) {
            rolesToAdd.push(lastRoleId);
          }
        }
      }
    });

    roleIds.forEach((roleId) => {
      const role = roles.find((r) => r.id.toString() === roleId);
      if (!role) return;

      const allPermissionsUnchecked = role.permissions.every(
        (permission) => !permissionIds.includes(permission.id.toString())
      );

      if (allPermissionsUnchecked) {
        rolesToRemove.push(roleId);
      }
    });

    if (rolesToAdd.length > 0 || rolesToRemove.length > 0) {
      const newRoles = [
        ...roleIds.filter((roleId) => !rolesToRemove.includes(roleId)),
        ...rolesToAdd,
      ];
      setValue("role_ids", newRoles);
    }

    setUpdateRoles(false);
  }, [selectedPermissions, roles, setValue, selectedRoles, updateRoles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (roleId: string, checked: boolean) => {
    const currentRoles = selectedRoles || [];
    let newRoles: string[];

    if (checked) {
      newRoles = [...currentRoles, roleId];
    } else {
      newRoles = currentRoles.filter((id) => id !== roleId);
    }

    setValue("role_ids", newRoles);
    setUpdatePermissions(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = selectedPermissions || [];
    let newPermissions: string[];

    if (checked) {
      newPermissions = [...currentPermissions, permissionId];
    } else {
      newPermissions = currentPermissions.filter((id) => id !== permissionId);
    }

    setValue("permission_ids", newPermissions);
    setUpdateRoles(true);
  };

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    formData.append("role_id", data.role_ids.join(","));
    formData.append("department_id", data.department_ids.join(","));
    formData.append("permissions_id", data.permission_ids.join(","));

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      await createUser(formData);
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const filteredRoles = roles.filter((role) => role.role !== "Retired");

  const allPermissions = roles
    .flatMap((role) => role.permissions)
    .filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id)
    );

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="btn btn-ghost btn-sm mr-2"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <h1 className="font-bold">Create New User</h1>
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo upload section */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-32 h-32 mask mask-squircle bg-base-300 flex items-center justify-center relative overflow-hidden">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="user avatar preview"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <Upload
                        size={32}
                        className="text-base-content opacity-40 absolute inset-0 m-auto"
                      />
                    )}
                  </div>
                </div>
                <div className="form-control w-full">
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* User details section */}
              <div className="w-full md:w-2/3">
                {/* Name and Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Roles */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Roles</span>
                    <span className="label-text-alt text-info">
                      Select at least one
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filteredRoles.map((role) => (
                      <div key={role.id} className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            value={role.id}
                            checked={selectedRoles?.includes(
                              role.id.toString()
                            )}
                            onChange={(e) =>
                              handleRoleChange(
                                role.id.toString(),
                                e.target.checked
                              )
                            }
                          />
                          <span className="label-text ml-2">{role.role}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.role_ids && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.role_ids.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Departments */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Departments</span>
                    <span className="label-text-alt text-info">
                      Select at least one
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Controller
                      name="department_ids"
                      control={control}
                      render={({ field }) => (
                        <>
                          {Array.isArray(departments) &&
                            departments.map((dept) => (
                              <div key={dept.id} className="form-control">
                                <label className="label cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    value={dept.id}
                                    checked={field.value.includes(
                                      dept.id.toString()
                                    )}
                                    onChange={(e) => {
                                      const value = dept.id.toString();
                                      const newValues = e.target.checked
                                        ? [...field.value, value]
                                        : field.value.filter(
                                            (v) => v !== value
                                          );
                                      field.onChange(newValues);
                                    }}
                                  />
                                  <span className="label-text ml-2">
                                    {dept.department_name}
                                  </span>
                                </label>
                              </div>
                            ))}
                        </>
                      )}
                    />
                  </div>
                  {errors.department_ids && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.department_ids.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Permissions */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Permissions</span>
                    <span className="label-text-alt text-info">
                      Auto-selected based on roles. You can customize.
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allPermissions.map((permission) => {
                      const rolesWithPermission = roles
                        .filter((role) =>
                          role.permissions.some((p) => p.id === permission.id)
                        )
                        .map((role) => role.role);

                      return (
                        <div key={permission.id} className="form-control">
                          <label className="label cursor-pointer">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              value={permission.id}
                              checked={selectedPermissions?.includes(
                                permission.id.toString()
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  permission.id.toString(),
                                  e.target.checked
                                )
                              }
                            />
                            <div className="ml-2">
                              <span className="label-text">
                                {permission.permission}
                              </span>
                              <div className="text-xs text-opacity-60 text-base-content">
                                {rolesWithPermission.join(", ")}
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {errors.permission_ids && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.permission_ids.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="submit"
                className="btn btn-primary btn-wide"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Create User"
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
