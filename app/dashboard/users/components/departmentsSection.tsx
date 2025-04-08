"use client";

import { Department } from "@/api/models";
import { Controller, Control } from "react-hook-form";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";

type UserFormValues = z.infer<typeof userFormSchema>;

interface DepartmentsSectionProps {
  departments: Department[];
  control: Control<UserFormValues>;
  error?: string;
}

const DepartmentsSection = ({
  departments,
  control,
  error,
}: DepartmentsSectionProps) => {
  return (
    <div className="form-control mt-4">
      <label className="label">
        <span className="label-text">Department</span>
        <span className="label-text-alt text-info">Select one</span>
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
                        type="radio"
                        className="radio radio-primary"
                        value={dept.id}
                        checked={field.value[0] === dept.id.toString()}
                        onChange={(e) => {
                          field.onChange([e.target.value]);
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
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default DepartmentsSection;
