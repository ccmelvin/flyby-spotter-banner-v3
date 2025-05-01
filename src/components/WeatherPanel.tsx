// WeatherPanel.tsx
"use client";

import { Weather } from "../types";
import {
  Wind,
  Eye,
  Layers,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
} from "lucide-react";

interface WeatherPanelProps {
  weatherData: Weather;
  windDirection?: number;
}

export default function WeatherPanel({
  weatherData,
  windDirection = 0,
}: WeatherPanelProps) {
  // Map weather icon codes to our icons
  const getWeatherIcon = (iconCode: string | undefined) => {
    if (!iconCode) return <Sun className="h-7 w-7 text-blue-950" />;

    // Map OpenWeather icon codes to our icons
    if (iconCode.includes("01"))
      return <Sun className="h-9 w-9 text-blue-950" />; // clear
    if (iconCode.includes("02") || iconCode.includes("03"))
      return <CloudSun className="h-9 w-9 text-blue-950" />; // few/scattered clouds
    if (iconCode.includes("04"))
      return <Cloud className="h-9 w-9 text-blue-950" />; // broken/overcast clouds
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className="h-9 w-9 text-blue-950" />; // rain

    // Default
    return <Sun className="h-9 w-9 text-blue-950" />;
  };

  // Format visibility in appropriate units
  const formatVisibility = (visibility: number | undefined) => {
    if (!visibility) return "N/A";
    // Convert meters to miles if needed
    const visibilityInMiles = visibility / 1609.34;
    return `${visibilityInMiles.toFixed(1)} mi`;
  };

  return (
    <div className="flex justify-center w-full  bg-gradient-to-r from-amber-500 to-amber-600 p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-tr-[10px] rounded-br-[10px]">
      <div className="text-stone-100 flex items-center justify-between gap-5">
        <div className="flex flex-col border-r border-amber-400/50 mr-2 pr-4 md:pr-6">
          <div className="flex gap-2 text-[34px] font-bold text-blue-950">
            {getWeatherIcon(weatherData?.icon)}
            <div className=" gap-3 text-[30px] font-bold text-blue-950">
              {weatherData?.temperature}°F
            </div>
          </div>
          <div className="mt-[5px]  text-center text-[25px] mr-[5px] font-mono text-blue-800">
            {weatherData.main}
          </div>
        </div>
        <div className="flex flex-col border-r border-amber-400/50 pr-4 md:pr-4">
          <div className="flex items-center justify-center uppercase text-[25px] text-blue-800 mb-1 font-medium">
            <Wind className="h-5 w-5 mr-2 text-blue-800" />
            <span>Wind</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-950 font-semibold text-[30px]">
              {weatherData?.wind_direction || windDirection}°{" "}
              {weatherData?.wind}kts
              {weatherData?.wind_gusts ? ` G${weatherData.wind_gusts}` : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col border-r border-amber-400/50 pr-6 md:pr-6">
          <div className="flex items-center uppercase text-[25px] text-blue-800 mb-1 font-medium">
            <Eye className="h-5 w-5 mr-2 text-blue-800" />
            VIS
          </div>
          <div className="flex items-center">
            <span className="text-blue-950 text-center font-semibold text-[30px]">
              {formatVisibility(weatherData?.visibility)}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center uppercase text-[25px] text-blue-800 mb-1 font-medium">
            <Layers className="h-5 w-5 mr-2 text-blue-800" />
            CEILING
          </div>
          <div className="text-blue-950 text-center font-semibold text-[30px]">
            {weatherData?.raw_metar?.includes("SCT") ? "SCT" : "CLR"}
          </div>
        </div>
      </div>
    </div>
  );
}
