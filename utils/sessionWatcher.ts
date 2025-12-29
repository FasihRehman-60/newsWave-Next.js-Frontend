"use client";

export function startSessionWatcher(): () => void {
  // Safety check (extra-safe for Next.js)
  if (typeof window === "undefined") {
    return () => {};
  }

  const checkSession = (): void => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      window.location.href = "/signin";
    }
  };

  const intervalId = window.setInterval(checkSession, 5000);

  // Return cleanup function (VERY important)
  return () => window.clearInterval(intervalId);
}
