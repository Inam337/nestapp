export enum CommonIconNames {
  HOME_ICON = "HOME_ICON",
  ORDERS_ICON = "ORDERS_ICON",
  PRODUCTS_ICON = "PRODUCTS_ICON",
  CATEGORIES_ICON = "CATEGORIES_ICON",
  STOCK_ICON = "STOCK_ICON",
  REPORTS_ICON = "REPORTS_ICON",
  MENU_ICON = "MENU_ICON",
  ARROW_RIGHT_ICON = "ARROW_RIGHT_ICON",
}

export interface IconType {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
}

export interface IconProps extends IconType {
  name: CommonIconNames;
}

export const IconColors = {
  WHITE_COLOR_ICON: "#FFFFFF",
  GRAY_COLOR_ICON: "#9CA3AF",
  PRIMARY_COLOR_ICON: "#3B82F6",
  HAM_BURGER_ARROW: "#FFFFFF",
} as const;
