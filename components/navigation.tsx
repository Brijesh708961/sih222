// components/navigation.tsx - REPLACE ENTIRE FILE
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import {
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  GraduationCap,
  LogOut,
  User,
} from "lucide-react";

interface NavigationProps {
  userType: "student" | "faculty" | "admin";
}

export function Navigation({ userType }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAppStore(); // UPDATED: use logout from store
  const router = useRouter();

  const studentNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/attendance", label: "Attendance", icon: Users },
    { href: "/learning", label: "Learning", icon: BookOpen },
  ];

  const facultyNavItems = [
    // Point faculty links to existing teacher routes to avoid 404s
    { href: "/teacher/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/teacher/schedule", label: "Schedule", icon: Calendar },
    { href: "/teacher/attendance", label: "Attendance", icon: Users },
    { href: "/teacher/dashboard", label: "Students", icon: GraduationCap },
  ];

  const adminNavItems = [
    // NEW: added admin navigation
    { href: "/admin-dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/classes", label: "Classes", icon: BookOpen },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  // UPDATED: handle all three user types
  const getNavItems = () => {
    switch (userType) {
      case "student":
        return studentNavItems;
      case "faculty":
        return facultyNavItems;
      case "admin":
        return adminNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  // UPDATED: use proper logout function from store
  const handleLogout = () => {
    logout(); // This clears all state
    router.push("/login"); // Redirect to login page
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            {" "}
            {/* UPDATED: link to dashboard instead of home */}
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Smart Scholar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* User Menu - UPDATED: simplified logic */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={currentUser.name}
                      />
                      <AvatarFallback>
                        {getUserInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {currentUser.userType}
                      </p>{" "}
                      {/* ADDED: show user type */}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // UPDATED: if no user, show login/signup (shouldn't happen with AuthGuard)
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              {currentUser ? (
                <>
                  <div className="border-t border-border my-2 pt-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={currentUser.name}
                        />
                        <AvatarFallback>
                          {getUserInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {currentUser.userType}
                        </p>{" "}
                        {/* ADDED: show user type */}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mx-3 justify-start bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                // UPDATED: simplified for non-authenticated users
                <div className="flex flex-col gap-2 mt-2 px-3">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
