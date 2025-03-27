"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

import {
  Lightbulb,
  Tags,
  File,
  Settings,
  Users,
  BriefcaseBusiness,
  Moon,
  Sun,
  LogOut,
  Sliders,
  UserCircle,
} from "lucide-react";

const pathVariants = {
  closed: {
    d: "M4 6h16M4 12h16M4 18h16",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    transition: { duration: 0.3 },
  },
  open: {
    d: "M6 18L18 6M6 6l12 12",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    transition: { duration: 0.3 },
  },
};

const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
    display: "none",
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
    display: "block",
  },
};

const NavBar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("/dashboard");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (!menu.includes("settings")) {
      router.push(menu);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && resolvedTheme) {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSwitch = () => {
    const newTheme = resolvedTheme === "abyss" ? "lemonade" : "abyss";
    console.log("Switching theme from:", resolvedTheme, "to:", newTheme); // Debug log
    setTheme(newTheme);
  };

  const ThemeIcon = mounted ? (resolvedTheme === "abyss" ? Moon : Sun) : Sun;
  const themeLabel = mounted
    ? resolvedTheme === "abyss"
      ? "Dark"
      : "Light"
    : "Light";

  return (
    <>
      <div className="navbar bg-base-100 z-50">
        <div className="flex-1">
          <Image src="/logo.png" alt="EWSD" width={82} height={82} />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-2">
          <ul className="menu bg-base-200 menu-horizontal gap-1 rounded-xl text-base-content">
            <li>
              <a
                onClick={() => handleMenuClick("/dashboard")}
                className={`${activeMenu === "/dashboard" ? "active" : ""} text-base-content`}
              >
                <Lightbulb size={16} />
                Home
              </a>
            </li>
            <li>
              <a
                onClick={() => handleMenuClick("/dashboard/users")}
                className={activeMenu === "/dashboard/users" ? "active" : ""}
              >
                <Users size={16} />
                Users
              </a>
            </li>
            <li>
              <a
                onClick={() => handleMenuClick("/dashboard/departments")}
                className={
                  activeMenu === "/dashboard/departments" ? "active" : ""
                }
              >
                <BriefcaseBusiness size={16} />
                Departments
              </a>
            </li>
            <li>
              <a
                onClick={() => handleMenuClick("/dashboard/category")}
                className={activeMenu === "/dashboard/category" ? "active" : ""}
              >
                <Tags size={16} />
                Category
              </a>
            </li>
            <li>
              <a
                onClick={() => handleMenuClick("/dashboard/reports")}
                className={activeMenu === "/dashboard/reports" ? "active" : ""}
              >
                <File size={16} />
                Reports
              </a>
            </li>
            <li>
              <details open={activeMenu === "/dashboard/settings"}>
                <summary
                  className={
                    activeMenu === "/dashboard/settings" ? "active" : ""
                  }
                >
                  <a
                    onClick={() => handleMenuClick("/dashboard/settings")}
                    className={`flex items-center gap-2`}
                  >
                    <Settings size={16} />
                    Settings
                  </a>
                </summary>
                <ul className="shadow-sm rounded-md p-2 bg-base-200 w-full z-50">
                  <li>
                    <a
                      onClick={() => navigateTo("/dashboard/settings/account")}
                      className="flex items-center gap-2 py-2"
                    >
                      <UserCircle size={16} />
                      Account
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={handleThemeSwitch}
                      className="flex items-center gap-2 py-2 w-full"
                    >
                      <ThemeIcon size={16} />
                      {themeLabel}
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigateTo("/dashboard/settings/system")}
                      className="flex items-center gap-2 py-2"
                    >
                      <Sliders size={16} />
                      System
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        /* handle logout */
                      }}
                      className="flex items-center gap-2 py-2 text-error hover:bg-error/10"
                    >
                      <LogOut size={16} />
                      Logout
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  variants={pathVariants}
                  initial="closed"
                  animate={isDropdownOpen ? "open" : "closed"}
                />
              </motion.svg>
            </div>
            {isDropdownOpen && (
              <motion.ul
                initial="closed"
                animate={isDropdownOpen ? "open" : "closed"}
                variants={dropdownVariants}
                tabIndex={0}
                className="dropdown-content z-[1] menu p-4 shadow bg-base-200 rounded-box w-52 mt-2"
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
                  <a onClick={() => navigateTo("/dashboard/departments")}>
                    <BriefcaseBusiness size={16} />
                    Departments
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard/category")}>
                    <Tags size={16} />
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
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
