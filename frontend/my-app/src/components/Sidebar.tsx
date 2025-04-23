"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllRoutes } from "@/app/routes";
import { CommonIcon } from "@/common/icons/CommonIcon";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { CommonIconNames, IconColors } from "@/common/icons/types";

const ICON_SIZE = 24;

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Check if the given path is active (exact match or active sub-route)
  const isActiveRoute = (routePath: string) => {
    // Exact match
    if (pathname === routePath) return true;

    // Sub-route match (e.g. /categories/edit should highlight /categories)
    if (routePath !== "/" && pathname.startsWith(routePath)) return true;

    return false;
  };

  // Prevent hydration issues by not rendering until client-side
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <CommonIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            name={
              !isOpen
                ? CommonIconNames.MENU_ICON
                : CommonIconNames.ARROW_RIGHT_ICON
            }
            fill={IconColors.HAM_BURGER_ARROW}
            className="transition duration-150 ease-out hover:ease-in"
          />
        </button>
      )}

      {/* Backdrop Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? "fixed left-0 top-0 z-40 transition-transform duration-300 transform "
            : "h-100 bg-gray-800 flex"
        } ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <ProSidebar
          collapsed={!isMobile && collapsed}
          backgroundColor="rgb(31 41 55)"
          className={`bg-gray-800 h-100 ${isMobile ? "pt-16" : "pt-0"}`}
          width={!isMobile && collapsed ? "80px" : "250px"}
          style={{ minHeight: "100vh" }}
        >
          {!isMobile && (
            <div className="p-4 flex justify-between items-center">
              {!collapsed && (
                <h1 className="text-white text-xl font-semibold">Dashboard</h1>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <CommonIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  name={
                    collapsed
                      ? CommonIconNames.ARROW_RIGHT_ICON
                      : CommonIconNames.MENU_ICON
                  }
                  fill={IconColors.HAM_BURGER_ARROW}
                  className="transition duration-150 ease-out hover:ease-in"
                />
              </button>
            </div>
          )}

          <Menu
            menuItemStyles={{
              button: {
                backgroundColor: "transparent",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgb(55 65 81)",
                },
                [`&.active`]: {
                  backgroundColor: "rgb(17 24 39)",
                  borderLeft: "4px solid #3B82F6",
                  fontWeight: "bold",
                },
              },
            }}
          >
            {getAllRoutes().map((route) => {
              const isActive = isActiveRoute(route.path);
              return (
                <MenuItem
                  key={route.path}
                  component={<Link href={route.path} />}
                  className={isActive ? "bg-blue-400" : ""}
                  icon={
                    <CommonIcon
                      width={20}
                      height={20}
                      name={route.icon.name}
                      fill={isActive ? "#fff" : route.icon.fill}
                    />
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {route.label}
                </MenuItem>
              );
            })}
          </Menu>
        </ProSidebar>
      </div>
    </>
  );
};

export default Sidebar;
