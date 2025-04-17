// FlightBannerTop.tsx
"use client";

import { useAnimationControl } from "../hooks/useAnimationControl";
import WeatherPanel from "./WeatherPanel";
import FlightPanel from "./FlightPanel";
import { useAirportData } from "@/hooks/useAirportData";

const formatAirportName = (airportName: string): string => {
  const abbreviations: Record<string, string> = {
    Intl: "International",
    Reg: "Regional",
    Muni: "Municipal",
  };

  let formattedName = airportName;

  Object.entries(abbreviations).forEach(([abbr, full]) => {
    formattedName = formattedName.replace(new RegExp(abbr, "g"), full);
  });

  formattedName = formattedName.replace(/,\s*[A-Z]{2},\s*US$/, "");

  if (!formattedName.toLowerCase().includes("airport")) {
    formattedName = `${formattedName} Airport`;
  }

  return formattedName;
};

export default function FlightBannerTop({
  airportCode = "RDU",
  airportName = "",
  location = "",
}) {
  const { currentFlight, weatherData, isNewEntry, error } =
    useAirportData(airportCode);

  const { activeBox, getTransformClass } = useAnimationControl();

  const displayAirportCode = airportCode;
  const displayAirportName = weatherData?.airport_name
    ? formatAirportName(weatherData.airport_name)
    : airportName;
  const displayLocation = weatherData?.city || location;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row relative rounded-l-[5px]">
     {/* Left section - Airport info */}
<div className="bg-white border-l-2 border-[#F66A6F] p-6 md:w-[500px] flex-shrink-0 overflow-hidden shadow-lg">
  {/* Radar Sweep - Moved to top */}
  <div className="flex items-center gap-3 mb-1">
    <div className="relative h-5 w-5 rounded-full border border-rose-500">
      <div className="absolute top-1/2 left-1/2 h-[1px] w-[40%] bg-rose-500 origin-left animate-[spin_3s_linear_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-rose-500 -translate-x-1/2 -translate-y-1/2"></div>
    </div>
    <span className="text-[15px] font-bold text-rose-500 tracking-widest">
      LIVE
    </span>
  {/* Airport Code */}
  <div className="text-slate-700 text-[17px]">
    {displayAirportCode} / KRDU
  </div>
  </div>
  
  
  {/* Airport Name */}
  <h1 className="text-[28px] md:text-xl font-bold text-slate-700">
    {displayAirportName}
  </h1>
  
  {/* Location */}
  <div className="text-slate-700 text-[18px] mr-8">
    {displayLocation}, North Carolina
  </div>
</div>


      {/* Right section - Dynamic content box */}
      <div className="relative overflow-hidden md:w-[600px] flex-shrink-0 h-[110px] md:h-auto">
        {/* Weather Panel */}
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out transform ${
            activeBox === "yellow" ? getTransformClass() : "-translate-x-full"
          }`}
        >
          {weatherData && <WeatherPanel weatherData={weatherData} />}
        </div>

        {/* Flight Panel */}
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out transform ${
            activeBox === "blue" ? getTransformClass() : "-translate-x-full"
          }`}
        >
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
