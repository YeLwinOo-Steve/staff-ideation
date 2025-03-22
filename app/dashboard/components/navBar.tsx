"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Group, File, Settings, Users, Menu } from "lucide-react";

const NavBar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">EWSD</a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-2">
          <ul className="menu bg-base-200 menu-horizontal rounded-box">
            <li>
              <a onClick={() => navigateTo("/dashboard")}>
                <Lightbulb size={16} />
                Home
              </a>
            </li>
            <li>
              <a onClick={() => navigateTo("/dashboard/users")}>
                <Users size={16} />
                Users
              </a>
            </li>
            <li>
              <a onClick={() => navigateTo("/dashboard/category")}>
                <Group size={16} />
                Category
              </a>
            </li>
            <li>
              <a onClick={() => navigateTo("/dashboard/reports")}>
                <File size={16} />
                Reports
              </a>
            </li>
            <li>
              <a onClick={() => navigateTo("/dashboard/settings")}>
                <Settings size={16} />
                Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Menu size={24} />
            </div>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 mt-4"
              >
                <li>
                  <a onClick={() => navigateTo("/dashboard")}>
                    <Lightbulb size={16} />
                    Home
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard/users")}>
                    <Users size={16} />
                    Users
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard/category")}>
                    <Group size={16} />
                    Category
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard/reports")}>
                    <File size={16} />
                    Reports
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard/settings")}>
                    <Settings size={16} />
                    Settings
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
