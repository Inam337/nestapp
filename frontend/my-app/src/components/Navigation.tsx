import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllRoutes } from "@/app/routes";

export const Navigation = () => {
  const pathname = usePathname();
  const routes = getAllRoutes();

  return (
    <nav className="hidden md:flex space-x-4">
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={`text-gray-600 hover:text-gray-900 transition-colors ${
            pathname === route.path ? "text-gray-900 font-medium" : ""
          }`}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
