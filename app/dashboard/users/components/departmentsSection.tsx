"use client";

import { Department } from "@/api/models";
import { Building2 } from "lucide-react";
import { Control, useController } from "react-hook-form";
import { motion } from "framer-motion";

interface DepartmentsSectionProps {
  departments: Department[];
  control: Control<any>;
  error?: string;
}

export default function DepartmentsSection({
  departments,
  control,
  error,
}: DepartmentsSectionProps) {
  const { field } = useController({
    name: "department_ids",
    control,
  });

  const selectedDepartments = field.value || [];

  const handleDepartmentChange = (deptId: string) => {
    const newValue = [deptId];
    field.onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-info/10 p-3 rounded-xl">
          <Building2 className="w-5 h-5 text-info" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Department</h3>
          <p className="text-sm text-base-content/70">
            Select the department this user belongs to
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-error bg-error/5 p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {departments.map((dept) => (
          <motion.label
            key={dept.id}
            className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all
              ${
                selectedDepartments.includes(dept.id.toString())
                  ? "bg-info/10 border-2 border-info"
                  : "bg-base-200/50 hover:bg-base-200 border-2 border-transparent"
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              className="hidden"
              name="department"
              value={dept.id}
              checked={selectedDepartments.includes(dept.id.toString())}
              onChange={() => handleDepartmentChange(dept.id.toString())}
            />
            <div
              className={`p-1 rounded-lg ${
                selectedDepartments.includes(dept.id.toString())
                  ? "bg-info/20"
                  : "bg-base-300/50"
              }`}
            >
              <Building2
                className={`w-5 h-5 ${
                  selectedDepartments.includes(dept.id.toString())
                    ? "text-info"
                    : "opacity-50"
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="font-sm">{dept.department_name}</p>
            </div>
            {selectedDepartments.includes(dept.id.toString()) && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-info"
                layoutId="department-selected"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </motion.label>
        ))}
      </div>
    </div>
  );
}
