"use client";

import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Cloud,
  CloudSun,
  Radio,
  Bell,
  Clock,
  Sun,
  CloudRain,
} from "lucide-react";

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

interface AircraftData {
  callsign: string;
  type: string;
  registration: string;
  airline: string;
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

export default function FlightBanner() {
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

  // Aircraft data
  const aircraftData: AircraftData[] = [
    {
      callsign: "DAL2856",
      type: "B738",
      registration: "N3754A",
      airline: "Delta",
    },
    {
      callsign: "AAL7891",
      type: "A321",
      registration: "N172US",
      airline: "American",
    },
    {
      callsign: "UAL1234",
      type: "B739",
      registration: "N37464",
      airline: "United",
    },
    {
      callsign: "BAW287",
      type: "B789",
      registration: "G-ZBKR",
      airline: "British Airways",
    },
  ];

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
      text: "RDU is one of the fastest growing airports in the US",
      type: "fact",
    },
    {
      text: "They're using the south runway due to crosswinds today",
      type: "operations",
    },
    {
      text: "This A321 has the newer Airspace cabin interior",
      type: "aircraft",
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

  const [currentFlight, setCurrentFlight] = useState<FlightData>(flightData[0]);
  const [currentAircraft, setCurrentAircraft] = useState<AircraftData>(
    aircraftData[0]
  );
  const [airportStatus, setAirportStatus] = useState<AirportStatus>(
    airportStatuses[0]
  );
  const [currentCommentary, setCurrentCommentary] = useState<CommentaryData>(
    commentaryData[0]
  );
  const [currentRotatingContent, setCurrentRotatingContent] =
    useState<RotatingContent>(rotatingContent[0]);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [showRotatingContent, setShowRotatingContent] = useState<boolean>(true);

  const commentaryRef = useRef<HTMLDivElement>(null);

  // Update current time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Update flight and aircraft information
  useEffect(() => {
    let flightIndex = 0;

    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % flightData.length;
      setCurrentFlight(flightData[flightIndex]);
      setCurrentAircraft(aircraftData[flightIndex]);
      setIsNewEntry(true);

      // Reset animation class after animation completes
      setTimeout(() => {
        setIsNewEntry(false);
      }, 500);
    }, 8000);

    return () => clearInterval(flightInterval);
  }, []);

  // Update airport status occasionally
  useEffect(() => {
    let statusIndex = 0;

    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % airportStatuses.length;
      setAirportStatus(airportStatuses[statusIndex]);
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
          setCurrentCommentary(commentaryData[commentaryIndex]);
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
      setShowRotatingContent(false);

      setTimeout(() => {
        setCurrentRotatingContent(rotatingContent[contentIndex]);
        setShowRotatingContent(true);
      }, 500);
    }, 15000);

    return () => clearInterval(contentInterval);
  }, []);

  // Helper function to get the appropriate weather icon
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="size-7 text-sky-400" />;
      case "partly_cloudy_day":
        return <CloudSun className="size-7 text-sky-400" />;
      case "cloud":
        return <Cloud className="size-7 text-sky-400" />;
      case "rainy":
        return <CloudRain className="size-7 text-sky-400" />;
      default:
        return <Sun className="size-7 text-sky-400" />;
    }
  };

  // Get rotating content icon
  const getRotatingContentIcon = (type: string) => {
    switch (type) {
      case "radio":
        return <Radio className="size-4 text-indigo-300" />;
      case "social":
        return <Bell className="size-4 text-indigo-300" />;
      case "event":
        return <Clock className="size-4 text-indigo-300" />;
      default:
        return <Activity className="size-4 text-indigo-300" />;
    }
  };

  // Format the origin to highlight the airport code
  const formatOrigin = (origin: string) => {
    const parts = origin.split("(");
    if (parts.length === 2) {
      const city = parts[0].trim();
      const code = parts[1].replace(")", "");
      return (
        <>
          {city} <span className="text-indigo-300 font-bold">{code}</span>
        </>
      );
    }
    return origin;
  };

  return (
    <div className="w-full bg-[linear-gradient(to_bottom,rgb(16_24_39/0.85),rgb(16_24_39/0.95))] backdrop-blur-md border-2 border-indigo-500/60 font-sans text-white shadow-[0_4px_20px_rgb(0_0_0/0.3)] rounded-lg">

      <div className="flex h-[130px] max-w-[1920px] mx-auto">
        {/* Left section - Flight info */}
        <div className="w-[35%] p-2.5 border-r border-indigo-500/20 flex flex-col justify-center">
          <div
            className={`flex gap-4 ${
              isNewEntry ? "animation-[slide-in-from-left_0.5s_ease-out]" : ""
            }`}
          >
            <div className="flex flex-col">
              <div className="text-xs text-indigo-300 mb-1 uppercase tracking-wider font-medium">
                Flight
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-100">
                {currentFlight.flight}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-indigo-300 mb-1 uppercase tracking-wider font-medium">
                From
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-100">
                {formatOrigin(currentFlight.origin)}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-indigo-300 mb-1 uppercase tracking-wider font-medium">
                Landed
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-slate-100">
                {currentFlight.landed}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-indigo-300 mb-1 uppercase tracking-wider font-medium">
                Status
              </div>
              <div
                className={`text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5 ${
                  currentFlight.statusClass === "on-time"
                    ? "text-green-400"
                    : "text-rose-400"
                }`}
              >
                <span
                  className={`size-2 rounded-full inline-block ${
                    currentFlight.statusClass === "on-time"
                      ? "bg-green-400 shadow-[0_0_8px_rgb(74_222_128/0.6)] animation-[pulse_2s_infinite]"
                      : "bg-rose-400 shadow-[0_0_8px_rgb(251_113_133/0.6)] animation-[pulse_1s_infinite]"
                  }`}
                ></span>
                {currentFlight.status}
              </div>
            </div>
          </div>
        </div>

        {/* Middle section - Aircraft info and commentary */}
        <div className="w-[40%] p-2.5 border-r border-indigo-500/20 flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="font-mono font-bold text-base text-indigo-100 tracking-wider">
              {currentAircraft.callsign}
            </div>
            <div className="flex gap-3 mt-1">
              <span className="font-mono text-sm text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                {currentAircraft.type}
              </span>
              <span className="font-mono text-sm text-indigo-300">
                {currentAircraft.registration}
              </span>
              <span className="text-sm text-indigo-100">
                {currentAircraft.airline}
              </span>
            </div>
          </div>

          <div
            ref={commentaryRef}
            className="flex items-center gap-2 bg-indigo-500/10 px-2.5 py-1.5 rounded border-l-[3px] border-indigo-300 transition-[opacity_0.5s] animation-[slide-in-from-left_0.5s_ease-out]"
          >
            <div
              className={`text-base ${
                currentCommentary.type === "fact"
                  ? "text-blue-400"
                  : currentCommentary.type === "aircraft"
                  ? "text-emerald-400"
                  : "text-amber-500"
              }`}
            >
              {currentCommentary.type === "fact" && "📊"}
              {currentCommentary.type === "aircraft" && "✈️"}
              {currentCommentary.type === "operations" && "🔧"}
            </div>
            <div className="text-sm text-indigo-100 leading-snug">
              {currentCommentary.text}
            </div>
          </div>
        </div>

        {/* Right section - Weather and airport status */}
        <div className="w-[25%] p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherData.icon)}
              <div className="text-xl font-bold text-slate-100">
                {weatherData.temp}
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-indigo-300 uppercase tracking-wider">
                  Wind
                </span>
                <span className="font-mono text-xs text-indigo-100">
                  {weatherData.wind}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-indigo-300 uppercase tracking-wider">
                  Vis
                </span>
                <span className="font-mono text-xs text-indigo-100">
                  {weatherData.visibility}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-indigo-300 uppercase tracking-wider">
                  Ceiling
                </span>
                <span className="font-mono text-xs text-indigo-100">
                  {weatherData.ceiling}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                airportStatus.status === "normal"
                  ? "bg-green-400/20 text-green-400 border border-green-400/30"
                  : airportStatus.status === "minor-delays"
                  ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                  : "bg-rose-400/20 text-rose-400 border border-rose-400/30"
              }`}
            >
              {airportStatus.statusText}
            </div>
            <div className="font-mono text-sm font-bold text-indigo-100">
              {currentTime}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker with rotating content */}
      <div className="relative h-6 bg-gray-900/95 border-t border-indigo-500/20 overflow-hidden">
        <div
          className={`flex items-center gap-2 px-4 h-full transition-[all_0.5s] ${
            showRotatingContent
              ? "opacity-100 translate-x-0 animation-[slide-in-from-left_0.5s_ease-out]"
              : "opacity-0 translate-x-[-20px]"
          }`}
        >
          {getRotatingContentIcon(currentRotatingContent.icon)}
          <span className="text-sm text-indigo-100">
            {currentRotatingContent.text}
          </span>
          {currentRotatingContent.timeRemaining && (
            <span className="font-mono text-sm font-bold text-amber-500 ml-2">
              in {currentRotatingContent.timeRemaining} min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
