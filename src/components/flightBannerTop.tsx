// FlightBannerTop.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAirportData } from "../app/services/api";
import { useAnimationControl } from "../hooks/useAnimationControl";
import WeatherPanel from "./WeatherPanel";
import FlightPanel from "./FlightPanel";
import { useState, useEffect } from "react";

export default function FlightBannerTop({
  airportCode = "RDU",
  airportName = "",
  location = "",

}) {
  // Animation control
  const { activeBox, getTransformClass } = useAnimationControl();
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [previousFlightNumber, setPreviousFlightNumber] = useState<string | null>(null);

  // Fetch airport data
  const { 
    data: airportData,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['airport-data', airportCode],
    queryFn: () => fetchAirportData(airportCode),
    refetchInterval: 30000
  });

  // Track flight changes for animation
  useEffect(() => {
    if (airportData?.flights[0]) {
      const currentFlightNumber = airportData.flights[0].flight_number;
      if (previousFlightNumber && previousFlightNumber !== currentFlightNumber) {
        setIsNewEntry(true);
        setTimeout(() => setIsNewEntry(false), 500);
      }
      setPreviousFlightNumber(currentFlightNumber);
    }
  }, [airportData?.flights[0]?.flight_number]);

  // Adapt the API response
  const currentFlight = airportData?.flights[0] || null;
  const weatherData = airportData?.weather ? {
    temp: `${airportData.weather.temperature}°`,
    condition: airportData.weather.description,
    icon: airportData.weather.icon,
    wind: `${airportData.weather.wind}`,
  } : null;

  // Display info
  const displayAirportCode = airportCode;
  const displayAirportName = airportData?.weather?.airport_name || airportName;
  const displayLocation = `${airportData?.weather?.city || ''}, USA` || location;
 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row relative rounded-l-[5px]">
      {/* Left section - Airport info */}
      <div className="bg-white border-l-2 border-[#F66A6F] p-7 md:w-auto max-w-auto overflow-hidden shadow-lg">
        <div className="text-slate-700 text-[17px]">{displayAirportCode}</div>
        <h1 className="text-[25px] md:text-1xl font-bold text-slate-700">{displayAirportName}</h1>
        <div className="text-slate-700 text-[17px] mr-3">{displayLocation}</div>
      </div>

      {/* Right section - Dynamic content box */}
      <div className="relative overflow-hidden inline-flex min-w-[750px] h-[160px] md:h-[auto]">
        {/* Weather Panel */}
        <div className={`absolute w-full h-full transition-transform duration-1000 ease-in-out transform ${
          activeBox === "yellow" ? getTransformClass() : "-translate-x-full"
        }`}>
          {weatherData && (
            <WeatherPanel
            weatherData={weatherData}
            windDirection={airportData?.weather?.wind_direction}
            isVisible={activeBox === "yellow"}
            transformClass={getTransformClass()}
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
