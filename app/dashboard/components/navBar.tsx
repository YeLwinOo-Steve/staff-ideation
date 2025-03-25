"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Lightbulb,
  Tags,
  File,
  Settings,
  Users,
  BriefcaseBusiness,
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigateTo = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
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
