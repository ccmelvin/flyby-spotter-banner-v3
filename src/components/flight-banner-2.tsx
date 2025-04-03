"use client";

import {  useEffect, useRef } from "react";
import { Cloud, CloudSun, Sun, CloudRain } from "lucide-react";

// Types for our data
interface FlightData {
  flight: string;
  origin: string;
  landed: string;
  runway: string;
  duration: string;
  status: string;
  statusClass: "on-time" | "delayed";
}

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  city: string;
  wind: string;
  visibility: string;
  ceiling: string;
}



interface AirportStatus {
  status: "normal" | "minor-delays" | "ground-stop";
  statusText: string;
}

interface CommentaryData {
  text: string;
  type: "fact" | "aircraft" | "operations";
}

interface RotatingContent {
  type: "atc" | "social" | "event";
  text: string;
  icon: string;
  timeRemaining?: number;
}

export default function FlightBanner2() {
  // Sample flight data
  const flightData: FlightData[] = [
    {
      flight: "UA 1234",
      origin: "San Francisco (SFO)",
      landed: "14:35",
      runway: "27R",
      duration: "5h 23m",
      status: "ON TIME",
      statusClass: "on-time",
    },
    {
      flight: "DL 2856",
      origin: "Atlanta (ATL)",
      landed: "14:42",
      runway: "18L",
      duration: "3h 45m",
      status: "ON TIME",
      statusClass: "on-time",
    },
    {
      flight: "AA 7891",
      origin: "Chicago (ORD)",
      landed: "14:50",
      runway: "27L",
      duration: "2h 15m",
      status: "DELAYED",
      statusClass: "delayed",
    },
    {
      flight: "BA 0287",
      origin: "London (LHR)",
      landed: "15:05",
      runway: "18R",
      duration: "9h 40m",
      status: "ON TIME",
      statusClass: "on-time",
    },
  ];

  // Weather data
  const weatherData: WeatherData = {
    temp: "72°F",
    condition: "Partly Cloudy",
    icon: "partly_cloudy_day",
    city: "Raleigh",
    wind: "8kt 240°",
    visibility: "10SM",
    ceiling: "BKN035",
  };



  // Airport status
  const airportStatuses: AirportStatus[] = [
    { status: "normal", statusText: "Normal Operations" },
    { status: "minor-delays", statusText: "Minor Delays" },
    { status: "ground-stop", statusText: "Ground Stop" },
  ];

  // Live commentary snippets
  const commentaryData: CommentaryData[] = [
    {
      text: "That 787 is equipped with the Rolls-Royce Trent 1000 engines",
      type: "aircraft",
    },
    {
      text: "They're using the south runway due to crosswinds today",
      type: "operations",
    },
    {
      text: "Fun fact: RDU handled over 14 million passengers in 2019",
      type: "fact",
    },
  ];

  // Rotating content
  const rotatingContent: RotatingContent[] = [
    {
      type: "atc",
      text: 'Tower: "Delta 2856, cleared to land runway 23L"',
      icon: "radio",
    },
    {
      type: "social",
      text: "Follow us on Twitter @FlybySpotter for more content!",
      icon: "social",
    },
    {
      type: "event",
      text: "Special Emirates A380 arrival",
      icon: "event",
      timeRemaining: 45,
    },
    {
      type: "atc",
      text: 'Ground: "American 7891, taxi to gate C21 via Alpha"',
      icon: "radio",
    },
    {
      type: "social",
      text: "Join our Discord community - link in description",
      icon: "social",
    },
  ];

  const commentaryRef = useRef<HTMLDivElement>(null);



  // Update flight and aircraft information
  useEffect(() => {
    let flightIndex = 0;

    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % flightData.length;
      

   
    }, 8000);

    return () => clearInterval(flightInterval);
  }, []);

  // Update airport status occasionally
  useEffect(() => {
    let statusIndex = 0;

    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % airportStatuses.length;

    }, 20000);

    return () => clearInterval(statusInterval);
  }, []);

  // Update commentary
  useEffect(() => {
    let commentaryIndex = 0;

    const commentaryInterval = setInterval(() => {
      commentaryIndex = (commentaryIndex + 1) % commentaryData.length;

      if (commentaryRef.current) {
        commentaryRef.current.style.opacity = "0";

        setTimeout(() => {
        
          if (commentaryRef.current) {
            commentaryRef.current.style.opacity = "1";
          }
        }, 500);
      }
    }, 12000);

    return () => clearInterval(commentaryInterval);
  }, []);

  // Update rotating content
  useEffect(() => {
    let contentIndex = 0;

    const contentInterval = setInterval(() => {
      contentIndex = (contentIndex + 1) % rotatingContent.length;
     

  
    }, 15000);

    return () => clearInterval(contentInterval);
  }, []);

  // Helper function to get the appropriate weather icon
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="size-7 text-stone-100" />;
      case "partly_cloudy_day":
        return <CloudSun className="size-7 text-stone-100" />;
      case "cloud":
        return <Cloud className="size-7 text-stone-100" />;
      case "rainy":
        return <CloudRain className="size-7 text-stone-100" />;
      default:
        return <Sun className="size-7 text-stone-100" />;
    }
  };


  return (
    <div className=" bg-blue-950 font-sans">
      <div className="flex h-[70px]   ">
        {/*  Section - Weather and airport status */}
        <div className="w-[65%] p-3 flex flex-col justify-between ">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 ">
              {getWeatherIcon(weatherData.icon)}
              <div className="text-xl text-slate-100">
                {weatherData.temp}
              </div>
            </div>
            <div className="flex gap-6">

                <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[13px] text-indigo-300 uppercase tracking-wider">
                  Wind
                </span>
                <span className="font-mono text-[12px] text-indigo-100">
                  {weatherData.wind}
                </span>
              </div>
              <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-indigo-300 uppercase tracking-wider">
                  Vis
                </span>
                <span className="font-mono text-xs text-indigo-100">
                  {weatherData.visibility}
                </span>
              </div>
              <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-indigo-300 uppercase tracking-wider">
                  Ceiling
                </span>
                <span className="font-mono text-xs text-indigo-100">
                  {weatherData.ceiling}
                </span>
              </div>
              <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
