// FlightBannerTop.tsx
"use client";
import { useState, useEffect } from "react";
import { useAnimationControl } from "../hooks/useAnimationControl";
import WeatherPanel from "./WeatherPanel";
import FlightPanel from "./FlightPanel";
import { useAirportData } from "@/hooks/useAirportData";
import Image from "next/image"; // Use Next.js Image component instead of plain Img
import logoImage from "../../public/flyby-spotter-logo.png";

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

  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);
  const displayAirportCode = airportCode;
  const displayAirportName = weatherData?.airport_name
    ? formatAirportName(weatherData.airport_name)
    : airportName;
  const displayLocation = weatherData?.city || location;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row relative rounded-l-[5px] h-auto">
      {/* Left section - Airport info */}
      <div className="bg-white  ">
        <Image
          src={logoImage}
          alt="Flyby Spotter Logo"
          width={100}
          height={100}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
      <div className="bg-white border-l-2 border-[#F66A6F] p-4 md:w-fit  md:max-w-[1200px] flex-shrink-0 overflow-hidden shadow-lg">
        <div className="flex items-center gap-4 mb-1 ">
          <div className="relative h-5 w-5 rounded-full border border-rose-500">
            <div className="absolute top-1/2 left-1/2 h-[1px] w-[40%] bg-rose-500 origin-left animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-rose-500 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <span className="text-[25px] font-bold text-rose-500 tracking-widest">
            LIVE
          </span>
          <div className="mt-[3px] text-center text-[25px] mb-1 font-mono text-blue-800">
            {currentTime}
          </div>
          <div className="text-slate-700 text-[25px]">
            {displayAirportCode} / KRDU
          </div>
          {/* Airport Code */}
        </div>

        {/* Airport Name */}
        <div className="text-1xl md:text-3xl font-bold text-slate-700 mb-1">
          {displayAirportName}
        </div>

        {/* Location */}
        <div className="text-slate-700 text-[25px] mr-8">
          {displayLocation}, North Carolina
        </div>
      </div>

      {/* Right section - Dynamic content box */}
      <div className="relative overflow-hidden flex-shrink-0 h-full flex items-stretch">
        {/* Weather */}
        {activeBox === "yellow" && weatherData && (
          <div
            className={`w-fit h-full flex items-center  transition-all duration-1000 ease-in-out ${getTransformClass()}`}
          >
            <WeatherPanel weatherData={weatherData} />
          </div>
        )}
        {/* Flight Panel */}
        {activeBox === "blue" && currentFlight && (
          <div
            className={`w-fit h-full flex items-center transition-all duration-1000 ease-in-out ${getTransformClass()}`}
          >
            <FlightPanel
              currentFlight={currentFlight}
              isNewEntry={isNewEntry}
            />
          </div>
        )}
      </div>
    </div>
  );
}
