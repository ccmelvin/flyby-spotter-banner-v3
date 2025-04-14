"use client";

import { useEffect, useState } from "react";
import FlightBannerBottom from "@/components/FlightBannerBottom";
import FlightApproachDisplay from "@/components/FlightApproachDisplay";
import { mockFlightData } from "@/utils/mockData";

export default function BannerTop() {
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlightIndex((prev) => 
        prev === mockFlightData.flights.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentFlight = mockFlightData.flights[currentFlightIndex];

  return (
    <div className="min-h-screen ">
      <div className="mt-[30px] p-6">
      <FlightApproachDisplay
          flight={{
            title: "Upcoming Landing",
            number: currentFlight.flight_number,
            airline: currentFlight.flight_number.substring(0, 3),
            origin: currentFlight.origin_city,
            runway: currentFlight.runway,
            originCode: currentFlight.origin,
            registration: currentFlight.registration,
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
