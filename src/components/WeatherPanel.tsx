// components/WeatherPanel.tsx
"use client";

import { Wind, Eye, Layers } from "lucide-react";
import { Weather } from "../types";

interface WeatherPanelProps {
  weatherData: Weather;
  windDirection?: number;

}

export default function WeatherPanel({ weatherData, windDirection = 0 }: WeatherPanelProps) {
  // Calculate ceiling value - this is a placeholder as it's not in your data
  // You might need to adjust this based on actual data
  const ceiling = "BKN035"; // Example value
  
  // Calculate visibility - this is a placeholder as it's not in your data
  const visibility = "10SM"; // Example value



  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-7 md:p-[auto] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-r-[10px]">
      <div className="text-stone-100 flex items-center justify-between gap-4">
        <div className="flex flex-col border-r border-amber-400/50 pr-4 md:pr-4">
          <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
            <Wind className="h-5 w-5 mr-2 text-blue-800" />
            Wind
          </div>
          <div className="flex items-center">
            <span className="text-blue-950 font-semibold text-lg">
              {windDirection}° {weatherData.wind}kts
            </span>
          </div>
        </div>
        <div className="flex flex-col border-r border-amber-400/50 pr-4 md:pr-6">
          <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
            <Eye className="h-5 w-5 mr-2 text-blue-800" />
            VIS
          </div>
          <div className="flex items-center">
            <span className="text-blue-950 font-semibold text-lg">{visibility}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
            <Layers className="h-5 w-5 mr-2 text-blue-800" />
            CEILING
          </div>
          <div className="text-blue-950 font-semibold text-lg">{ceiling}</div>
        </div>
      </div>
    </div>
  );
}
