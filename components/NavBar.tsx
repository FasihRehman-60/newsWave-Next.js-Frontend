"use client"; 

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

interface NavLinkItem {
  to: string;
  label: string;
  exact?: boolean;
}

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/auth");
  };

  const navLinks: NavLinkItem[] = [
    { to: "/", label: "Home", exact: true },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/category/business", label: "Business" },
    { to: "/category/technology", label: "Technology" },
    { to: "/category/sports", label: "Sports" },
    { to: "/category/entertainment", label: "Entertainment" },
    { to: "/category/health", label: "Health" },
    { to: "/category/science", label: "Science" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string, exact: boolean = false) =>
    exact ? pathname === path : pathname?.startsWith(path);

  if (pathname === "/auth") return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-linear-to-b from-white/95 to-amber-50/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-col items-start">
            <Link href="/" className="text-2xl font-bold tracking-tight leading-none">
              <span className="text-gray-900">News</span>
              <span className="text-amber-500">Wave</span>
            </Link>
            <p className="text-gray-600 text-xs font-medium mt-0.5">
              Stay informed. Stay inspired.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-7 ml-10">
            {navLinks.map(({ to, label, exact }) => (
              <Link key={label} href={to} className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(to, exact)
                    ? "text-amber-600 font-semibold"
                    : "text-gray-700 hover:text-amber-600"}`}>{label}               
              </Link>
            ))}
          </div>

          {/* Right Button (Desktop) */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <button onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-600 transition shadow-md">
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <Link href="/auth"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-md shadow-sm transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg px-4 py-4 mt-2 space-y-4">
            <div className="flex flex-col gap-3">
              {navLinks.map(({ to, label, exact }) => (
                <Link
                  key={label}
                  href={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2 px-2 rounded-md ${
                    isActive(to, exact)
                      ? "bg-amber-500 text-white"
                      : "text-gray-800 hover:bg-amber-100"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-200">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-red-600 transition"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="w-full block text-center bg-amber-500 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-amber-600 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
