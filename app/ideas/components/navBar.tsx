"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { hasPermission, hasAnyRole } from "@/app/lib/utils";

import {
  Lightbulb,
  Blocks,
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
  ChartPie,
} from "lucide-react";

import LogoutDialog from "./LogoutDialog";

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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);

    function handleClickOutside(event: MouseEvent) {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme handling
  const handleThemeSwitch = () => {
    if (!mounted) return;
    const newTheme = resolvedTheme === "abyss" ? "lemonade" : "abyss";
    setTheme(newTheme);
  };

  const handleNavigation = (path: string) => {
    console.log("navigating to", path);
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
  };

  const canManageDepartments = hasAnyRole(user, [
    "Administrator",
    "admin",
    "QA Manager",
  ]);

  const canViewDashboard = hasPermission(user, "view reports");

  if (!mounted) {
    return (
      <div className="navbar bg-base-100 z-50">
        <div className="flex-1">
          <Image
            src="/logo.png"
            alt="EWSD"
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16 dark:invert"
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
            src={theme === "abyss" ? "/dark/logo.png" : "/logo.png"}
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
                href="/ideas"
                className={`${pathname === "/ideas" ? "active" : ""} text-base-content flex items-center gap-2`}
                suppressHydrationWarning
              >
                <Lightbulb size={16} />
                Ideas
              </Link>
            </li>
            {hasPermission(user, "user") && (
              <li>
                <Link
                  href="/ideas/users"
                  className={`${pathname === "/ideas/users" ? "active" : ""} flex items-center gap-2`}
                  suppressHydrationWarning
                >
                  <Users size={16} />
                  Users
                </Link>
              </li>
            )}
            {hasPermission(user, "manage category") && (
              <li>
                <Link
                  href="/ideas/categories"
                  className={`${pathname === "/ideas/categories" ? "active" : ""} flex items-center gap-2`}
                  suppressHydrationWarning
                >
                  <Blocks size={16} />
                  Categories
                </Link>
              </li>
            )}
            {canManageDepartments && (
              <li>
                <Link
                  href="/ideas/departments"
                  className={`${pathname === "/ideas/departments" ? "active" : ""} flex items-center gap-2`}
                  suppressHydrationWarning
                >
                  <Building2 size={16} />
                  Departments
                </Link>
              </li>
            )}
            {canViewDashboard && (
              <li>
                <Link
                  href="/ideas/dashboard"
                  className={`${pathname === "/ideas/dashboard" ? "active" : ""} flex items-center gap-2`}
                  suppressHydrationWarning
                >
                  <ChartPie size={16} />
                  Dashboard
                </Link>
              </li>
            )}

            {hasPermission(user, "system setting") && (
              <li>
                <Link
                  href="/ideas/settings/system"
                  className={`flex items-center gap-2 ${pathname === "/ideas/settings/system" ? "active" : ""}`}
                  suppressHydrationWarning
                >
                  <Sliders size={16} />
                  System
                </Link>
              </li>
            )}
            <li>
              <details
                ref={detailsRef}
                open={isSettingsOpen}
                suppressHydrationWarning
              >
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
                      href="/ideas/settings/account"
                      className={`flex items-center gap-2 ${pathname === "/ideas/settings/account" ? "active" : ""}`}
                      onClick={() => setIsSettingsOpen(false)}
                      suppressHydrationWarning
                    >
                      <UserCircle size={16} />
                      Account
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleThemeSwitch();
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center gap-2"
                      suppressHydrationWarning
                    >
                      <ThemeIcon size={16} />
                      {themeLabel}
                    </a>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <a
                      onClick={() => {
                        setShowLogoutDialog(true);
                        setIsSettingsOpen(false);
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
                    href="/ideas"
                    className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                    onClick={() => handleNavigation("/ideas")}
                  >
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-base sm:text-lg">Ideas</span>
                  </Link>

                  <div className="divider my-0.5 sm:my-1"></div>

                  {hasPermission(user, "user") && (
                    <>
                      <Link
                        href="/ideas/users"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                        onClick={() => handleNavigation("/ideas/users")}
                      >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-base sm:text-lg">Users</span>
                      </Link>

                      <div className="divider my-0.5 sm:my-1"></div>
                    </>
                  )}

                  {hasPermission(user, "category") && (
                    <>
                      <Link
                        href="/ideas/categories"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                        onClick={() => handleNavigation("/ideas/categories")}
                      >
                        <Blocks className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-base sm:text-lg">Categories</span>
                      </Link>

                      <div className="divider my-0.5 sm:my-1"></div>
                    </>
                  )}

                  {canManageDepartments && (
                    <>
                      <Link
                        href="/ideas/departments"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                        onClick={() => handleNavigation("/ideas/departments")}
                      >
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-base sm:text-lg">
                          Departments
                        </span>
                      </Link>
                      <div className="divider my-0.5 sm:my-1"></div>
                    </>
                  )}
                  {canViewDashboard && (
                    <>
                      <Link
                        href="/ideas/dashboard"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-3 sm:px-4 hover:bg-base-200 rounded-xl transition-colors"
                        onClick={() => handleNavigation("/ideas/dashboard")}
                      >
                        <ChartPie className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-base sm:text-lg">Dashboard</span>
                      </Link>
                      <div className="divider my-0.5 sm:my-1"></div>
                    </>
                  )}

                  {hasPermission(user, "system setting") && (
                    <Link
                      href="/ideas/settings/system"
                      className="flex items-center gap-2 sm:gap-3 py-1 px-2 sm:px-3 hover:bg-base-300 rounded-lg transition-colors"
                      onClick={() => handleNavigation("/ideas/settings/system")}
                    >
                      <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-sm sm:text-base">System</span>
                    </Link>
                  )}
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
                        href="/ideas/settings/account"
                        className="flex items-center gap-2 sm:gap-3 py-1 px-2 sm:px-3 hover:bg-base-300 rounded-lg transition-colors"
                        onClick={() =>
                          handleNavigation("/ideas/settings/account")
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
                    </div>
                  </div>

                  <div className="divider my-0.5 sm:my-1"></div>

                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-2 sm:gap-3 py-2 px-3 sm:px-4 w-full hover:bg-error/10 text-error rounded-lg"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-base sm:text-lg">Logout</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </>
  );
};

export default NavBar;
