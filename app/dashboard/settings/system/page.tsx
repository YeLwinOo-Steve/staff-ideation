import { Sliders } from "lucide-react";
import React from "react";

const SystemSettingsPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 pb-6">
        <Sliders className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-200/50 p-6 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold">General Settings</h2>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
