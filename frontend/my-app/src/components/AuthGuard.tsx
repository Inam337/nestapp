"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have token in Redux state, we're authenticated
    if (token) {
      setIsLoading(false);
      return;
    }

    // Fallback to localStorage if Redux state is empty
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      router.push("/auth/login");
    }

    setIsLoading(false);
  }, [token, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
