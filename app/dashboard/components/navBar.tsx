"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

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
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const menuVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme handling
  const handleThemeSwitch = () => {
    if (!mounted) return;
    const newTheme = resolvedTheme === "abyss" ? "lemonade" : "abyss";
    setTheme(newTheme);
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
  };

  if (!mounted) {
    return (
      <div className="navbar bg-base-100 z-50">
        <div className="flex-1">
          <Image
            src="/logo.png"
            alt="EWSD"
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
        </div>
      </div>
    );
  }

  const ThemeIcon = resolvedTheme === "abyss" ? Moon : Sun;
  const themeLabel = resolvedTheme === "abyss" ? "Dark" : "Light";

  return (
    <>
      <div
        className="navbar sticky top-0 bg-base-100 z-50"
        suppressHydrationWarning
      >
        <div className="flex-1">
          <Image
            src="/logo.png"
            alt="EWSD"
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-2">
          <ul className="menu bg-base-200 menu-horizontal gap-1 rounded-xl text-base-content">
            <li>
              <Link
                href="/dashboard"
                className={`${pathname === "/dashboard" ? "active" : ""} text-base-content flex items-center gap-2`}
                suppressHydrationWarning
              >
                <Lightbulb size={16} />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className={`${pathname === "/dashboard/users" ? "active" : ""} flex items-center gap-2`}
                suppressHydrationWarning
              >
                <Users size={16} />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/departments"
                className={`${pathname === "/dashboard/departments" ? "active" : ""} flex items-center gap-2`}
                suppressHydrationWarning
              >
                <Building2 size={16} />
                Departments
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/category"
                className={`${pathname === "/dashboard/category" ? "active" : ""} flex items-center gap-2`}
                suppressHydrationWarning
              >
                <Blocks size={16} />
                Category
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/reports"
                className={`${pathname === "/dashboard/reports" ? "active" : ""} flex items-center gap-2`}
                suppressHydrationWarning
              >
                <FileArchive size={16} />
                Reports
              </Link>
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
                    <Link
                      href="/dashboard/settings/account"
                      className={`flex items-center gap-2 ${pathname === "/dashboard/settings/account" ? "active" : ""}`}
                      suppressHydrationWarning
                    >
                      <UserCircle size={16} />
                      Account
                    </Link>
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
                    <Link
                      href="/dashboard/settings/system"
                      className={`flex items-center gap-2 ${pathname === "/dashboard/settings/system" ? "active" : ""}`}
                      suppressHydrationWarning
                    >
                      <Sliders size={16} />
                      System
                    </Link>
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

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            className="btn btn-circle btn-ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.div
              initial={false}
              animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-base-100 z-40 md:hidden flex flex-col"
          >
            {/* Fixed Header Space */}
            <div className="h-16"></div>

            {/* Content Container - will center content if less than 60vh */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto">
              <div className="w-full max-h-[60vh] sm:max-h-[50vh] min-h-fit flex flex-col items-center p-2">
                <motion.div
                  variants={itemVariants}
                  className="w-full max-w-[95%] sm:max-w-md"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Home</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <Link
                    href="/dashboard/users"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/dashboard/users")}
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Users</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <Link
                    href="/dashboard/departments"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/dashboard/departments")}
                  >
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Departments</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <Link
                    href="/dashboard/category"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/dashboard/category")}
                  >
                    <Blocks className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Category</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/dashboard/reports")}
                  >
                    <FileArchive className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Reports</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  {/* Settings Section */}
                  <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input
                      type="checkbox"
                      checked={isSettingsOpen}
                      onChange={() => setIsSettingsOpen(!isSettingsOpen)}
                    />
                    <div className="collapse-title flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-base sm:text-lg">Settings</span>
                    </div>
                    <div className="collapse-content space-y-0.5 sm:space-y-1">
                      <Link
                        href="/dashboard/settings/account"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-2 sm:px-3 hover:bg-base-300 rounded-lg transition-colors"
                        onClick={() =>
                          handleNavigation("/dashboard/settings/account")
                        }
                      >
                        <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Account</span>
                      </Link>

                      <button
                        onClick={handleThemeSwitch}
                        className="flex items-center gap-2 sm:gap-3 py-1 px-2 sm:px-3 w-full hover:bg-base-300 rounded-lg transition-colors"
                      >
                        <ThemeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">
                          {themeLabel}
                        </span>
                      </button>

                      <Link
                        href="/dashboard/settings/system"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-2 sm:px-3 hover:bg-base-300 rounded-lg transition-colors"
                        onClick={() =>
                          handleNavigation("/dashboard/settings/system")
                        }
                      >
                        <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">System</span>
                      </Link>
                    </div>
                  </div>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 sm:gap-3 py-2 px-3 sm:px-4 w-full hover:bg-error/10 bg-error text-white rounded-lg"
                  >
                    <LogOut className="w-4 h-8 sm:w-5 sm:h-8" />
                    <span className="text-base sm:text-lg">Logout</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
