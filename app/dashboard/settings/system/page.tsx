"use client";

import { useEffect, useState } from "react";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";
import { DatePicker, DatePickerProps } from "antd";
import { Dayjs } from "dayjs";
import { Sliders } from "lucide-react";
import { SystemSettingCard } from "./components/SystemSettingCard";
import { SystemSetting } from "@/api/models";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function SystemSettingsPage() {
  const { RangePicker } = DatePicker;
  const [activeTab, setActiveTab] = useState<"all" | "create">("all");
  const {
    createSystemSetting,
    fetchSystemSettings,
    updateSystemSetting,
    deleteSystemSetting,
    systemSettings,
    error,
    getCSV,
  } = useApiStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [formData, setFormData] = useState({
    idea_closure_date: "",
    final_closure_date: "",
    academic_year: "",
  });

  useEffect(() => {
    fetchSystemSettings();
  }, [fetchSystemSettings]);

  const isFormValid = () => {
    return (
      formData.idea_closure_date &&
      formData.final_closure_date &&
      formData.academic_year
    );
  };

  const onIdeaClosureChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        idea_closure_date: date.format("YYYY-MM-DD"),
      }));
    }
  };

  const onFinalClosureChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        final_closure_date: date.format("YYYY-MM-DD"),
      }));
    }
  };

  const onAcademicYearChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const academicYear = `${dates[0].format("YYYY")}-${dates[1].format("YYYY")}`;
      setFormData((prev) => ({
        ...prev,
        academic_year: academicYear,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await createSystemSetting({
        ...formData,
        status: 1,
      });
      showSuccessToast("System settings created successfully!");
      setFormData({
        idea_closure_date: "",
        final_closure_date: "",
        academic_year: "",
      });
      fetchSystemSettings();
    } catch (e) {
      console.log("system settings error", e);
      showErrorToast(error || "Failed to create system settings");
    }
  };

  const handleUpdate = async (e: React.FormEvent, setting: SystemSetting) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateSystemSetting(setting.id, {
        ...setting,
        ...formData,
      });
      showSuccessToast("System settings updated successfully!");
    } catch (e) {
      console.log("system settings error", e);
      showErrorToast(error || "Failed to update system settings");
    }
  };

  const handleDelete = async (e: React.FormEvent, setting: SystemSetting) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteSystemSetting(setting.id);
      showSuccessToast("System settings deleted successfully!");
    } catch (e) {
      console.log("system settings error", e);
      showErrorToast(error || "Failed to delete system settings");
    }
  };

  const handleDownload = async (e: React.FormEvent, setting: SystemSetting) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const blob = await getCSV(setting.id);

      if (!blob) {
        showErrorToast("Failed to download system settings");
        return;
      }

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `system-setting-${setting.academic_year}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      showSuccessToast("System settings downloaded successfully!");
    } catch (e) {
      console.log("system settings error", e);
      showErrorToast(error || "Failed to download system settings");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center gap-2 mb-8">
        <Sliders className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-bold">System Settings</h2>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden tabs tabs-boxed mb-6 tabs-lg">
        <button
          className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Settings
        </button>
        <button
          className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          New Settings
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - All Settings */}
        <motion.div
          className={`flex-1 ${activeTab === "create" ? "hidden lg:block" : ""} overflow-auto`}
          variants={containerVariants}
        >
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">All</h2>
            <span className="text-sm text-white badge badge-primary p-3 ml-2">
              {systemSettings.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 m-2">
            {Array.isArray(systemSettings) && systemSettings.length > 0 ? (
              systemSettings.map((setting) => (
                <SystemSettingCard
                  key={setting.id}
                  setting={setting}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No system settings found
              </div>
            )}
          </div>
        </motion.div>

        <div className="divider divider-horizontal"></div>

        {/* Right side - Create Form */}
        <motion.div
          className={`flex-1 ${activeTab === "all" ? "hidden lg:block" : ""} lg:sticky lg:top-24`}
          variants={formVariants}
        >
          <div className="prose">
            <h2 className="text-2xl font-bold mb-6">New</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Idea Closure Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium mb-2">
                    Idea Closure Date
                  </span>
                </label>
                <div className="relative">
                  <DatePicker
                    onChange={onIdeaClosureChange}
                    className="w-full h-12 bg-base-200 border border-base-300 rounded-lg"
                    placeholder="Pick idea closure date"
                  />
                </div>
              </div>

              {/* Final Closure Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium mb-2">
                    Final Closure Date
                  </span>
                </label>
                <div className="relative">
                  <DatePicker
                    onChange={onFinalClosureChange}
                    className="w-full h-12 bg-base-200 border border-base-300 rounded-lg"
                    placeholder="Pick final closure date"
                  />
                </div>
              </div>
            </div>

            {/* Academic Year */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Academic Year</span>
              </label>
              <RangePicker
                picker="year"
                className="w-full h-12 bg-base-200 border border-base-300 rounded-lg"
                onChange={onAcademicYearChange}
              />
            </div>

            <div className="divider divider-horizontal"></div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!isFormValid()}
              whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
            >
              New
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
