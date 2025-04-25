import { CommonIconNames } from "@/common/icons/types";

export interface RouteIcon {
  name: CommonIconNames;
  fill?: string;
}

export interface Route {
  path: string;
  label: string;
  icon: RouteIcon;
  isAuthRoute?: boolean;
}

// Define the routes without 'as const' to allow the optional isAuthRoute property
export const routes: Record<string, Route> = {
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    icon: {
      name: CommonIconNames.HOME_ICON,
      fill: "#9CA3AF",
    },
  },
  orders: {
    path: "/orders",
    label: "Orders",
    icon: {
      name: CommonIconNames.ORDERS_ICON,
      fill: "#9CA3AF",
    },
  },
  products: {
    path: "/products",
    label: "Products",
    icon: {
      name: CommonIconNames.PRODUCTS_ICON,
      fill: "#9CA3AF",
    },
  },
  categories: {
    path: "/categories",
    label: "Categories",
    icon: {
      name: CommonIconNames.CATEGORIES_ICON,
      fill: "#9CA3AF",
    },
  },
  stock: {
    path: "/stock",
    label: "Stock",
    icon: {
      name: CommonIconNames.STOCK_ICON,
      fill: "#9CA3AF",
    },
  },
  reports: {
    path: "/reports",
    label: "Reports",
    icon: {
      name: CommonIconNames.REPORTS_ICON,
      fill: "#9CA3AF",
    },
  },
  users: {
    path: "/users",
    label: "users",
    icon: {
      name: CommonIconNames.REPORTS_ICON,
      fill: "#9CA3AF",
    },
  },
  changePassword: {
    path: "/settings/change-password",
    label: "Change Password",
    icon: {
      name: CommonIconNames.MENU_ICON,
      fill: "#9CA3AF",
    },
  },
  login: {
    path: "/auth/login",
    label: "Login",
    icon: {
      name: CommonIconNames.ARROW_RIGHT_ICON,
      fill: "#9CA3AF",
    },
    isAuthRoute: true,
  },
  register: {
    path: "/auth/register",
    label: "Register",
    icon: {
      name: CommonIconNames.MENU_ICON,
      fill: "#9CA3AF",
    },
    isAuthRoute: true,
  },
};

// Helper function to get all routes
export const getAllRoutes = (): Route[] => {
  return Object.values(routes);
};

// Helper function to get routes for navigation (can exclude auth routes when logged in)
export const getNavigationRoutes = (isAuthenticated: boolean): Route[] => {
  return Object.values(routes).filter((route) => {
    return isAuthenticated ? !route.isAuthRoute : true;
  });
};

// Helper function to get route by path
export const getRouteByPath = (path: string): Route | undefined => {
  return Object.values(routes).find((route) => route.path === path);
};

// Helper function to check if a path is a valid route
export const isValidRoute = (path: string): boolean => {
  return Object.values(routes).some((route) => route.path === path);
};
