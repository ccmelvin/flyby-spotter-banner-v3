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
  Plane,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

export default function FlightBannerBottom() {
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
      text: "Follow us on Instagram @FlybySpotter for more content!",
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

  // Get rotating content icon
  const getRotatingContentIcon = (type: string) => {
    switch (type) {
      case "radio":
        return <Radio className="h-4 w-4 text-white" />;
      case "social":
        return <Bell className="h-4 w-4 text-white" />;
      case "event":
        return <Clock className="h-4 w-4 text-white" />;
      default:
        return <Activity className="h-4 w-4 text-white" />;
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
          {city} <span className="text-amber-500 font-bold">{code}</span>
        </>
      );
    }
    return origin;
  };

  // Get commentary icon based on type
  const getCommentaryIcon = (type: string) => {
    switch (type) {
      case "fact":
        return <Info className="h-4 w-4 text-cyan-500" />;
      case "aircraft":
        return <Plane className="h-4 w-4 text-emerald-500" />;
      case "operations":
        return <Activity className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-cyan-500" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg">
      <CardHeader className="bg-slate-50  border-b-[1px] border-rose-500 px-4 py-2  p-5 rounded-t-[10px] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-blue-950 tracking-wide ml-2">
            FLYBY SPOTTER
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Radar Sweep */}
          <div className="relative h-5 w-5 rounded-full border border-rose-500">
            <div className="absolute top-1/2 left-1/2 h-[1px] w-[40%] bg-rose-500 origin-left animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-rose-500 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <span className="text-xs font-bold text-rose-500 tracking-widest">
            LIVE
          </span>
          {/* Digital Clock */}
          <span className="text-xs font-mono text-blue-950 ml-1">
            {currentTime}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Commentary section */}
        <div
          ref={commentaryRef}
          className="flex items-center gap-2 bg-white px-4 py-2 border-slate-100 border-[1px] transition-opacity duration-500 ease-out"
        >
          {getCommentaryIcon(currentCommentary.type)}
          <div className="text-sm text-slate-700 leading-snug">
            {currentCommentary.text}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Weather section */}
          <div className="p-1 flex flex-col justify-center items-center bg-slate-50">
            {/* {weatherData.city} */}
            <div className="flex items-center gap-2">
              <div>
                <div className="flex gap-3 text-[20px] font-bold text-blue-950">
                  {getWeatherIcon(weatherData.icon)}
                  {weatherData.temp}
                </div>
                <div className="mt-[5px] text-sm text-blue-9500">
                  {weatherData.condition}
                </div>
                <div className="mt-[10px] text-center text-sm mb-2 font-mono text-blue-800">
                  {currentTime}
                </div>
              </div>
            </div>
          </div>

          {/* Flight info section */}
          <div className="p-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Next Arrival
            </h3>

            <div
              className={`transition-all duration-300 ${
                isNewEntry ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-cyan-600" />
                <div className="text-md font-bold text-slate-800">
                  {currentFlight.flight}
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto ${
                    currentFlight.statusClass === "on-time"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {currentFlight.status}
                </Badge>
              </div>

              <div className="mt-2 text-sm text-slate-700">
                From: {formatOrigin(currentFlight.origin)}
              </div>
            </div>
          </div>

          {/* Aircraft details section */}
          <div className="p-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aircraft Details
            </h3>

            <div
              className={`transition-all duration-500 ${
                isNewEntry ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="text-md font-mono font-bold text-slate-800">
                {currentAircraft.callsign}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {currentAircraft.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-slate-700 border-slate-200"
                >
                  {currentAircraft.registration}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker with rotating content */}
        <div className="bg-blue-950 py-2 px-4 border-t border-slate-700">
          <div
            className={`flex items-center gap-2 transition-all duration-500 ${
              showRotatingContent
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-5"
            }`}
          >
            {getRotatingContentIcon(currentRotatingContent.icon)}
            <span className="text-sm text-white">
              {currentRotatingContent.text}
            </span>
            {currentRotatingContent.timeRemaining && (
              <span className="font-mono text-sm font-bold text-amber-600 ml-2">
                in {currentRotatingContent.timeRemaining} min
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
