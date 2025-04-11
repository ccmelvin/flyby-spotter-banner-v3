"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const accessToken = localStorage.getItem("auth0_access_token");
    const refreshToken = localStorage.getItem("auth0_refresh_token");
    
    if (!accessToken || !refreshToken) {
      // Redirect to sign in page if not authenticated
      router.push("/auth/signin");
      return;
    }
    
    // Extract user info from the access token
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUserEmail(payload.email);
    } catch (err) {
      console.error("Error parsing access token:", err);
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSignOut = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("auth0_access_token");
    localStorage.removeItem("auth0_refresh_token");
    
    // Redirect to home page
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Loading...</h1>
          <p className="text-center text-gray-500">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <p className="text-center text-gray-500">
          Welcome, {userEmail || "User"}!
        </p>
        <p className="text-center text-gray-500">
          You are now authenticated and can access protected resources.
        </p>
        <button
          onClick={handleSignOut}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
        >
          Sign Out
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
