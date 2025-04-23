"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Header />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
