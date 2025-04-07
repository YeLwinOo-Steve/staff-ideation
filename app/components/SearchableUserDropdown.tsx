"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { User } from "@/api/models";
import { Avatar } from "./Avatar";
import { useInView } from "framer-motion";

interface SearchableUserDropdownProps {
  users: User[];
  selectedUser?: User | null;
  onSelect: (user: User | null) => void;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchableUserDropdown({
  users,
  selectedUser,
  onSelect,
  onLoadMore,
  isLoading,
  hasMore,
  searchQuery,
  onSearchChange,
}: SearchableUserDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set initial search query when selected user changes
  useEffect(() => {
    if (selectedUser) {
      onSearchChange(selectedUser.name);
    }
  }, [selectedUser, onSearchChange]);

  // Open dropdown when typing
  useEffect(() => {
    if (searchQuery && !isOpen) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return (
      <div className="w-full">
        <div className="input input-bordered bg-base-200/50 flex items-center gap-2">
          <Search className="w-4 h-4 text-base-content/50" />
          <div className="flex-1 h-6" />
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUser ? (
          <div className="input input-bordered bg-base-200/50 flex items-center gap-2 pr-2">
            <div className="flex-1 flex items-center gap-2">
              <Avatar
                src={selectedUser.photo}
                alt={selectedUser.name}
                className="w-8 h-8"
              />
              <span suppressHydrationWarning>{selectedUser.name}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="input input-bordered bg-base-200/50 flex items-center gap-2">
            <Search className="w-4 h-4 text-base-content/50" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none"
              placeholder="Search QA Coordinator..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              suppressHydrationWarning
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && mounted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-2 bg-base-100 rounded-lg shadow-lg border border-base-200 max-h-64 overflow-y-auto"
          >
            <div className="relative">
              {users.length > 0 ? (
                <>
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      className="p-2 hover:bg-base-200 cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        onSelect(user);
                        setIsOpen(false);
                      }}
                      whileHover={{ backgroundColor: "hsl(var(--b2))" }}
                    >
                      <Avatar
                        src={user.photo}
                        alt={user.name}
                        className="w-8 h-8"
                      />
                      <div className="flex flex-col">
                        <span suppressHydrationWarning className="font-medium">{user.name}</span>
                        <span suppressHydrationWarning className="text-sm opacity-70">{user.email}</span>
                      </div>
                    </motion.div>
                  ))}
                  {hasMore && (
                    <div ref={loadMoreRef} className="p-2 text-center">
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm text-primary"></span>
                      ) : (
                        <span className="text-sm opacity-70">Scroll for more...</span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-base-content/70">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm text-primary"></span>
                  ) : (
                    <span suppressHydrationWarning>
                      {searchQuery ? "No users found" : "No QA coordinators available"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 