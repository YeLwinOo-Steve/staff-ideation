"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

import {
  Lightbulb,
  Blocks,
  FileArchive,
  Settings,
  Users,
  Building2,
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
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setActiveMenu(pathname || "/dashboard");
  }, [pathname]);

  const navigateTo = (path: string) => {
    if (mounted) {
      if (path.startsWith("/dashboard/settings")) {
        router.push(path);
        return;
      }
      router.push(path);
      setActiveMenu(path);
    }
  };

  const handleMenuClick = (menu: string) => {
    if (mounted) {
      if (menu === "/dashboard/settings") {
        setIsSettingsOpen(!isSettingsOpen);
        return;
      }

      router.push(menu);
      setActiveMenu(menu);
    }
  };

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

  // Theme handling
  const handleThemeSwitch = () => {
    if (!mounted) return;
    const newTheme = resolvedTheme === "abyss" ? "lemonade" : "abyss";
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="navbar bg-base-100 z-50">
        <div className="flex-1">
          <Image src="/logo.png" alt="EWSD" width={82} height={82} />
        </div>
        <div className="hidden md:flex gap-2">
          <ul className="menu bg-base-200 menu-horizontal gap-1 rounded-xl text-base-content"></ul>
        </div>
      </div>
    );
  }

  const ThemeIcon = resolvedTheme === "abyss" ? Moon : Sun;
  const themeLabel = resolvedTheme === "abyss" ? "Dark" : "Light";

  return (
    <div
      className="navbar sticky top-0 bg-base-100 z-50"
      suppressHydrationWarning
    >
      <div className="flex-1">
        <Image src="/logo.png" alt="EWSD" width={82} height={82} />
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-2">
        <ul className="menu bg-base-200 menu-horizontal gap-1 rounded-xl text-base-content">
          <li>
            <a
              onClick={() => handleMenuClick("/dashboard")}
              className={`${activeMenu === "/dashboard" ? "active" : ""} text-base-content flex items-center gap-2`}
              suppressHydrationWarning
            >
              <Lightbulb size={16} />
              Home
            </a>
          </li>
          <li>
            <a
              onClick={() => handleMenuClick("/dashboard/users")}
              className={`${activeMenu === "/dashboard/users" ? "active" : ""} flex items-center gap-2`}
              suppressHydrationWarning
            >
              <Users size={16} />
              Users
            </a>
          </li>
          <li>
            <a
              onClick={() => handleMenuClick("/dashboard/departments")}
              className={`${activeMenu === "/dashboard/departments" ? "active" : ""} flex items-center gap-2`}
              suppressHydrationWarning
            >
              <Building2 size={16} />
              Departments
            </a>
          </li>
          <li>
            <a
              onClick={() => handleMenuClick("/dashboard/category")}
              className={`${activeMenu === "/dashboard/category" ? "active" : ""} flex items-center gap-2`}
              suppressHydrationWarning
            >
              <Blocks size={16} />
              Category
            </a>
          </li>
          <li>
            <a
              onClick={() => handleMenuClick("/dashboard/reports")}
              className={`${activeMenu === "/dashboard/reports" ? "active" : ""} flex items-center gap-2`}
              suppressHydrationWarning
            >
              <FileArchive size={16} />
              Reports
            </a>
          </li>
          <li>
            <details open={isSettingsOpen} suppressHydrationWarning>
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  if (mounted) {
                    setIsSettingsOpen(!isSettingsOpen);
                  }
                }}
                className={`${isSettingsOpen ? "active" : ""}`}
                suppressHydrationWarning
              >
                <span className="flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </span>
              </summary>
              <ul className="menu menu-vertical shadow-sm rounded-md p-2 bg-base-200 full-width z-50">
                <li>
                  <a
                    onClick={() => {
                      if (mounted) {
                        navigateTo("/dashboard/settings/account");
                      }
                    }}
                    className={`flex items-center gap-2 ${
                      activeMenu === "/dashboard/settings/account"
                        ? "active"
                        : ""
                    }`}
                    suppressHydrationWarning
                  >
                    <UserCircle size={16} />
                    Account
                  </a>
                </li>
                <li>
                  <a
                    onClick={handleThemeSwitch}
                    className="flex items-center gap-2"
                    suppressHydrationWarning
                  >
                    <ThemeIcon size={16} />
                    {themeLabel}
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      if (mounted) {
                        navigateTo("/dashboard/settings/system");
                      }
                    }}
                    className={`flex items-center gap-2 ${
                      activeMenu === "/dashboard/settings/system"
                        ? "active"
                        : ""
                    }`}
                    suppressHydrationWarning
                  >
                    <Sliders size={16} />
                    System
                  </a>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <a
                    onClick={() => {
                      /* handle logout */
                    }}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
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
                  <Building2 size={16} />
                  Departments
                </a>
              </li>
              <li>
                <a onClick={() => navigateTo("/dashboard/category")}>
                  <Blocks size={16} />
                  Category
                </a>
              </li>
              <li>
                <a onClick={() => navigateTo("/dashboard/reports")}>
                  <FileArchive size={16} />
                  Reports
                </a>
              </li>
              <li>
                <a onClick={() => handleMenuClick("/dashboard/settings")}>
                  <Settings size={16} />
                  Settings
                </a>
              </li>
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
