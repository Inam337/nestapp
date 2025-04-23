import { CommonIconNames, IconType } from "./types";
import { HomeIcon } from "./home.icon";
// import { OrdersIcon } from "./orders.icon";
// import { ProductsIcon } from "./home.icon";
// import { CategoriesIcon } from "./home.icon";
// import { StockIcon } from "./home.icon";
// import { ReportsIcon } from "./home.icon";
import { MenuIcon } from "./menu.icon";
import { ArrowChevronRightIcon } from "./arrow-chevron-right.icon";

const iconComponents = {
  [CommonIconNames.HOME_ICON]: HomeIcon,
  [CommonIconNames.ORDERS_ICON]: HomeIcon,
  [CommonIconNames.PRODUCTS_ICON]: HomeIcon,
  [CommonIconNames.CATEGORIES_ICON]: HomeIcon,
  [CommonIconNames.STOCK_ICON]: HomeIcon,
  [CommonIconNames.REPORTS_ICON]: HomeIcon,
  [CommonIconNames.MENU_ICON]: MenuIcon,
  [CommonIconNames.ARROW_RIGHT_ICON]: ArrowChevronRightIcon,
};

interface CommonIconProps extends IconType {
  name: CommonIconNames;
}

export const CommonIcon: React.FC<CommonIconProps> = ({ name, ...props }) => {
  const IconComponent = iconComponents[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};
