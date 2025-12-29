"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams(); // <-- useParams for route parameters
  const token = params?.token; // make sure your route is like app/resetpassword/[token]/page.tsx

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(data.message);

      setMessage("Password reset successful! Redirecting to Sign In...");
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
          Reset Password
        </h2>

        <form className="space-y-5" onSubmit={handleReset}>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
            />
          </div>

          {error && <p className="text-red-600 text-sm sm:text-base text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm sm:text-base text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 sm:py-3 rounded-md font-semibold text-white transition ${
              loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

