"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/auth/auth.slice";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    console.log("Logging out user...");

    // Clear localStorage first to ensure data is gone
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Then dispatch logout action
    dispatch(logout());

    console.log("Redirecting to login page...");

    // Use window.location for a full page reload to reset all state
    window.location.href = "/auth/login";
  };

  return (
    <header className="bg-white shadow-md">
      <div
        className={`flex justify-between items-center px-6 py-4 ${
          isMobile ? "pl-16" : ""
        }`}
      >
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <span className="sr-only">Notifications</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {user && (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="font-medium text-sm">{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
