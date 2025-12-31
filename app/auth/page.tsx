"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AuthSlider from "@/components/AuthSlider";

const AuthPage = () => {
  const router = useRouter();

  return (
   <div className="min-h-screen bg-linear-to-r from-amber-50 to-gray-100 flex flex-col items-center px-3 sm:px-4 pt-8 sm:pt-10">

      {/* Logo */}
      <h1 className="mb-3 text-3xl sm:text-4xl font-extrabold">
        <span className="text-gray-900">News</span>
        <span className="text-amber-500">Wave</span>
      </h1>

      {/* Auth Card Wrapper */}
      <div className="relative w-full max-w-4xl">
        
        {/* Return Button */}
        <button
          onClick={() => router.push("/")}
          className="
            absolute top-2 left-4
            sm:top-3 sm:left-6
            px-3 py-1.5 sm:px-4 sm:py-2
            bg-amber-500 text-white
            rounded-md text-sm sm:text-base
            font-medium shadow-lg
            hover:bg-amber-400 transition
            z-10
          "
        >
          ← Return
        </button>

        {/* Auth Slider */}
        <AuthSlider />
      </div>

    </div>
  );
};

export default AuthPage;
