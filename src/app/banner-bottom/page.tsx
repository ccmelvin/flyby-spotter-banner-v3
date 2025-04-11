"use client";

import { useEffect, useState } from "react";

import FlightBannerBottom from "@/components/FlightBannerBottom";
import FlightApproachDisplay from "@/components/FlightApproachDisplay";

export default function BannerTop() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Check for access token
      const accessToken = localStorage.getItem("auth0_access_token");

      if (!accessToken) {
        window.location.href = "/auth/signin";
        return;
      }

      try {
        // Try to decode the JWT to get user info
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        setUserEmail(payload.email || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="mt-[30px] p-6">
        <FlightApproachDisplay  flight={{
                title: "Upcoming Landing",
                number: "1076",
                airline: "DAL",
                origin: "Atlanta",
                runway: "27R",
                originCode: "KATL",
                registration: "N123DL",
              }}
            />
        <FlightBannerBottom />
      </div>

      <div className="fixed bottom-20 left-10 flex gap-2">
        <button
          onClick={() => {
            localStorage.removeItem("auth0_access_token");
            localStorage.removeItem("auth0_refresh_token");
            window.location.href = "/auth/signin";
          }}
          className="px-6 py-3 bg-blue-800 text-white rounded-[5px] hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
