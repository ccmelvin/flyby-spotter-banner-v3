// components/WeatherPanel.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Weather } from "../types";
import { Wind, Eye, Layers,  Sun,
  Cloud,
  CloudSun,
  CloudRain, } from "lucide-react";

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

  // Add the weather icon helper function
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="h-7 w-7 text-blue-950" />;
      case "partly_cloudy_day":
        return <CloudSun className="h-7 w-7 text-blue-950" />;
      case "cloud":
        return <Cloud className="h-7 w-7 text-blue-950" />;
      case "rainy":
        return <CloudRain className="h-7 w-7 text-blue-950" />;
      default:
        return <Sun className="h-7 w-7 text-blue-950" />;
    }
  };

  return (
    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-tr-[10px] rounded-br-[10px]">
      <div className="text-stone-100 flex items-center justify-between gap-4">
        <div className="flex flex-col border-r border-amber-400/50 pr-7 md:pr-4">
        <div className="flex gap-3 text-[20px] font-bold text-blue-950">
              {weatherData && getWeatherIcon(weatherData.icon)}
              {weatherData && weatherData.temp}
            </div>
            <div className="mt-[5px] text-sm text-blue-9500">
              {weatherData && weatherData.condition}
            </div>
        <div className="mt-[10px] text-center text-sm mb-2 font-mono text-blue-800">
              {currentTime}
            </div>
       
        </div>
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
