import React from "react";
import NavBar from "../components/navBar";

const DepartmentsPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Departments</h1>
      </div>
    </div>
  );
};

export default DepartmentsPage;
