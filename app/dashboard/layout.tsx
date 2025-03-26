"use client";

import NavBar from "./components/navBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
