"use client";

import { User } from "@/api/models";
import { useFormContext } from "react-hook-form";

interface UserDetailsSectionProps {
  nameError?: string;
  emailError?: string;
  user?: User;
}

const UserDetailsSection = ({
  nameError,
  emailError,
  user,
}: UserDetailsSectionProps) => {
  const { register } = useFormContext();

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${nameError ? "input-error" : ""}`}
          {...register("name")}
          defaultValue={user?.name}
        />
        {nameError && (
          <label className="label">
            <span className="label-text-alt text-error">{nameError}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className={`input input-bordered ${emailError ? "input-error" : ""}`}
          {...register("email")}
          defaultValue={user?.email}
        />
        {emailError && (
          <label className="label">
            <span className="label-text-alt text-error">{emailError}</span>
          </label>
        )}
      </div>
    </>
  );
};

export default UserDetailsSection;
