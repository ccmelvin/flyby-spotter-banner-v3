"use client";

import { Moon, Wind, Cloud, CloudSun, Sun, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";


interface AirportDisplayProps {
  airportCode?: string;
  airportName?: string;
  location?: string;
  conditions?: string;
  temperature?: number;
  windDirection?: number;
  windSpeed?: number;
  timeZone?: "east" | "west";
  city?: string;
}

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  city: string;
}

export default function FlightBanner4({
  airportCode = "LHR",
  airportName = "London Heathrow",
  location = "London, United Kingdom ",
  conditions = "Clear",
  temperature = 18,
  windDirection = 270,
  windSpeed = 8,
  timeZone = "east",
}: AirportDisplayProps) {
  const [activeBox, setActiveBox] = useState<"yellow" | "blue">("yellow");
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState<"offscreen" | "center" | "exit">(
    "offscreen"
  );

  useEffect(() => {
    let isMounted = true;

    const animateBoxes = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      while (isMounted) {
        setActiveBox("yellow");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsAnimating(true);
        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setPosition("exit");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActiveBox("blue");
        setPosition("offscreen");
        await new Promise((resolve) => setTimeout(resolve, 100));
        setPosition("center");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setPosition("exit");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    animateBoxes();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTransformClass = () => {
    switch (position) {
      case "offscreen":
        return "-translate-x-full";
      case "center":
        return "translate-x-0";
      case "exit":
        return "-translate-x-full";
      default:
        return "translate-x-full";
    }
  };
  const weatherData: WeatherData = {
    temp: "72°F",
    condition: "Partly Cloudy",
    icon: "partly_cloudy_day",
    city: "London",
  };

  const [currentWeather] = useState<WeatherData>(weatherData);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="size-7 text-indigo-300" />;
      case "partly_cloudy_day":
        return <CloudSun className="size-7 text-indigo-300" />;
      case "cloud":
        return <Cloud className="size-7 text-indigo-300" />;
      case "rainy":
        return <CloudRain className="size-7 text-indigo-300" />;
      default:
        return <Sun className="size-7 text-indigo-300" />;
    }
  };
  const getTimeZone = () => {
    return `${timeZone === "east" ? "eastern" : "western"}`;
  };

  // Inside your component
const [showTemperature, setShowTemperature] = useState(true);

useEffect(() => {
  const interval = setInterval(() => {
    setShowTemperature(prev => !prev);
  }, 5000); // Switch every 5 seconds
  return () => clearInterval(interval);
}, []);





  return (
    <div className="flex flex-col md:flex-row relative  ">
      {/* Left section - Airport info */}
      <div className="bg-white border-l-2 border-[#F66A6F] p-2 md:w-auto z-10 max-w-auto overflow-hidden rounded-lg shadow-lg">
        <div className="text-gray-700 font-medium ">{airportCode}</div>

        <h1 className="text-3xl md:text-1xl font-bold text-black">
          {airportName}
        </h1>
        <div className="text-gray-700 mr-3">{location}</div>
      </div>

      {/* Right section - Dynamic content box */}
      <div className="relative overflow-hidden inline-flex ">
        <div
          className={` transition-transform duration-1000 ease-in-out transform ${getTransformClass()}`}
        >
          {activeBox === "yellow" ? (
            <div className="bg-amber-500 p-4 md:p-6 shadow-sm backdrop-blur-md rounded-tr-md-sm">
              <div className="text-stone-100 flex items-center justify-between ">
              <div className=" flex items-center justify-between border-r border-amber-400 pr-4 md:pr-6">
              {/* Temperature Section */}
              <div className={`flex justify-between items-center transition-all duration-200 ease-in-out ${
                showTemperature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'
              }`}>
                <div className="uppercase text-[20px] px-5 text-stone-50 mb-2">
                  {getWeatherIcon(currentWeather.icon)}
                </div>
                <div className="text-[25px] font-bold text-neutral-200 mb-2">
                  {Math.round((temperature * 9) / 5 + 32)}°
                  <span className="text-[25px]">F</span>
                </div>

              </div>
        
              {/* Time Section */}
              <div className={`flex flex-col items-center px-4 transition-all duration-200 ease-in-out ${
                !showTemperature ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 absolute'
              }`}>
                <div className="text-[16px] text-sky-50 mb-0">
                  <span className="text-[20px] font-bold">12:00pm</span>
                </div>
                <div className="flex items-center text-indigo-300">
                  {getTimeZone()}
                </div>
              </div>
            </div>
                <div className="flex flex-col items-center border-r border-amber-400 pr-4 md:pr-6">
                  <div className="uppercase text-[13px]  text-amber-400 mb-1">
                    Conditions
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Moon className="h-5 w-5 mr-2" />
                    <span>{conditions}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center border-r border-amber-200 px-4 md:px-6">
                  <div className="uppercase text-[13px]  text-amber-400 mb-1">
                    Temperature
                  </div>
                  <div className=" text-amber-500">
                    {temperature}°<span className="text-lg">c</span>
                  </div>
                </div>

                <div className="flex flex-col items-center px-4 md:px-6">
                  <div className="uppercase text-[13px] text-amber-400 mb-1">
                    Wind
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 mr-2 transform rotate-45 text-amber-500" />
                    <span className=" text-amber-500">
                      {windDirection}° {windSpeed}kts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sky-950 px-4 md:p-6 shadow-lg backdrop-blur-md relative overflow-hidden">
            <div className="text-sky-50 flex items-center justify-between">
              {/* Temperature Section */}
              <div className={`flex justify-between items-center transition-all duration-200 ease-in-out ${
                showTemperature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'
              }`}>
                <div className="uppercase text-[20px] px-5 text-indigo-300 mb-2">
                  {getWeatherIcon(currentWeather.icon)}
                </div>
                <div className="text-[25px] font-bold text-neutral-200 mb-2">
                  {Math.round((temperature * 9) / 5 + 32)}°
                  <span className="text-[25px]">F</span>
                </div>
              </div>
        
              {/* Time Section */}
              <div className={`flex flex-col items-center px-4 transition-all duration-200 ease-in-out ${
                !showTemperature ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 absolute'
              }`}>
                <div className="text-[16px] text-sky-50 mb-0">
                  <span className="text-[20px] font-bold">12:00pm</span>
                </div>
                <div className="flex items-center text-indigo-300">
                  {getTimeZone()}
                </div>
              </div>
            </div>
          </div>
            
          )}
        </div>
      </div>
    </div>
  );
}
