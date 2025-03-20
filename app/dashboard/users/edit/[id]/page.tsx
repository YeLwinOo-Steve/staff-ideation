"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Upload } from "lucide-react";
import NavBar from "../../../components/navBar";
import Image from "next/image";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role_id: z.string().min(1, "Role is required"),
  department_id: z.string().min(1, "Department is required"),
  permissions_id: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const EditUser = () => {
  const { updateUser, getUser, fetchDepartments, departments, isLoading } =
    useApiStore();
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      permissions_id: [],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true);
      await fetchDepartments();

      if (userId) {
        const user = await getUser(userId);
        if (user) {
          setValue("name", user.name);
          setValue("email", user.email);
          setValue("role_id", user.roles?.toString() || "");
          setValue("department_id", user.department?.toString() || "");

          if (user.permissions) {
            setValue("permissions_id", user.permissions);
          }

          if (user.photo) {
            setPhotoPreview(user.photo);
          }
        }
      }
      setIsPageLoading(false);
    };

    loadData();
  }, [userId, getUser, fetchDepartments, setValue]);

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

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role_id", data.role_id);
    formData.append("department_id", data.department_id);

    if (data.permissions_id && data.permissions_id.length > 0) {
      formData.append("permissions_id", data.permissions_id.join(","));
    }

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      await updateUser(userId, formData);
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (isPageLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="btn btn-ghost btn-sm mr-2"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} />
            <h1 className="font-bold">Edit User</h1>
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="avatar mb-4">
                  <div className="w-32 h-32 mask mask-squircle bg-base-300  flex items-center justify-center relative overflow-hidden">
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
                  <label className="label">
                    <span className="label-text">Profile Photo</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="w-full md:w-2/3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Role</span>
                    </label>
                    <select
                      className={`select select-bordered ${errors.role_id ? "select-error" : ""}`}
                      {...register("role_id")}
                    >
                      <option value="">Select a role</option>
                      <option value="1">Administrator</option>
                      <option value="2">QA Manager</option>
                      <option value="3">QA Coordinator</option>
                      <option value="4">Staff</option>
                    </select>
                    {errors.role_id && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.role_id.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department</span>
                    </label>
                    <select
                      className={`select select-bordered ${errors.department_id ? "select-error" : ""}`}
                      {...register("department_id")}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id.toString()}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.department_id.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Permissions</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "1", name: "Create" },
                      { id: "2", name: "Read" },
                      { id: "3", name: "Update" },
                      { id: "4", name: "Delete" },
                    ].map((permission) => (
                      <div key={permission.id} className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            value={permission.id}
                            {...register("permissions_id")}
                          />
                          <span className="label-text ml-2">
                            {permission.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
