// components/FlightBannerTop.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAirportInfo } from "../app/services/api";
import { useAnimationControl } from "../hooks/useAnimationControl";
import { useAirportData } from "../hooks/useAirportData";
import WeatherPanel from "./WeatherPanel";
import FlightPanel from "./FlightPanel";
import { AirportDisplayProps } from "../types";

export default function FlightBannerTop({
  airportCode = "RDU",
  airportName = "",
  location = "",
  windDirection = 0,
}: AirportDisplayProps) {
  // Animation control
  const { activeBox, getTransformClass } = useAnimationControl();

  // Fetch airport data (flights and weather)
  const { 
    currentFlight, 
    isNewEntry, 
    weatherData,
    isLoading: isLoadingAirportData 
  } = useAirportData(airportCode);

  // Fetch airport info
  const { 
    data: airportInfo, 
    isLoading: isLoadingAirport 
  } = useQuery({
    queryKey: ["airport-info", airportCode],
    queryFn: () => fetchAirportInfo(airportCode),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Use provided props or loaded data
  const displayAirportCode = airportName ? airportCode : airportInfo?.airportCode || airportCode;
  const displayAirportName = airportName || airportInfo?.airportName || "Loading...";
  const displayLocation = location || airportInfo?.location || "";
  const displayWindDirection = windDirection || airportInfo?.windDirection || 0;

  // Loading state
  if (isLoadingAirportData || isLoadingAirport) {
    // You could return a skeleton or loading state here
    // For now we'll continue and show loading placeholders where needed
  }

  return (
    <div className="flex flex-col md:flex-row relative rounded-l-[5px]">
      {/* Left section - Airport info */}
      <div className="bg-white border-l-2 border-[#F66A6F] p-4 md:w-auto max-w-auto overflow-hidden shadow-lg">
        <div className="text-slate-700 text-[17px]">{displayAirportCode}</div>
        <h1 className="text-[25px] md:text-1xl font-bold text-slate-700">{displayAirportName}</h1>
        <div className="text-slate-700 text-[17px] mr-3">{displayLocation}</div>
      </div>

      {/* Right section - Dynamic content box */}
      <div className="relative  overflow-hidden inline-flex min-w-[550px] h-[120px] md:h-[auto]">
        {/* Weather Panel */}
        <div className={`absolute w-full h-full  transition-transform duration-1000 ease-in-out transform ${
          activeBox === "yellow" ? getTransformClass() : "-translate-x-full"
        }`}>
          {weatherData && (
            <WeatherPanel
              weatherData={weatherData}
              windDirection={displayWindDirection}
            />
          )}
        </div>
        
        {/* Flight Panel */}
        <div className={`absolute w-full h-full transition-transform duration-1000 ease-in-out transform ${
          activeBox === "blue" ? getTransformClass() : "-translate-x-full"
        }`}>
          {currentFlight && (
            <FlightPanel
              currentFlight={currentFlight}
              isNewEntry={isNewEntry}
            />
          )}
        </div>
      </div>
    </div>
  );
}