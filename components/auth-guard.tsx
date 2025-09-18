// components/auth-guard.tsx - REPLACE ENTIRE FILE
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: "student" | "faculty" | "admin";
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const { isAuthenticated, currentUser } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated || !currentUser) {
      router.push("/login");
      return;
    }

    // If wrong user type, redirect to appropriate dashboard
    if (requiredUserType && currentUser.userType !== requiredUserType) {
      if (currentUser.userType === "student") {
        router.push("/dashboard");
      } else if (currentUser.userType === "faculty") {
        router.push("/faculty-dashboard");
      } else {
        router.push("/admin-dashboard");
      }
      return;
    }
  }, [isAuthenticated, currentUser, requiredUserType, router]);

  // Show loading while checking auth
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking authentication...</div>
      </div>
    );
  }

  // If wrong user type, show unauthorized
  if (requiredUserType && currentUser.userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Unauthorized - Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}
