"use client";

import { useState, useEffect, useRef } from "react";
import { Cloud, CloudSun, Sun, CloudRain } from "lucide-react";

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

interface TickerMessage {
  text: string;
  type: "flight" | "message";
}

export default function FlightBanner1() {
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

  const weatherData: WeatherData = {
    temp: "72°F",
    condition: "Partly Cloudy",
    icon: "partly_cloudy_day",
    city: "Raleigh",
    wind: "8kt 240°",
    visibility: "10SM",
    ceiling: "BKN035",
  };

  const airportStatuses: AirportStatus[] = [
    { status: "normal", statusText: "Normal Operations" },
    { status: "minor-delays", statusText: "Minor Delays" },
    { status: "ground-stop", statusText: "Ground Stop" },
  ];

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

  const tickerMessages: TickerMessage[] = [
    {
      text: "Next flight: JL 6502 from Tokyo (NRT) - Expected arrival: 16:20",
      type: "flight",
    },
    {
      text: "Welcome to the stream! Don't forget to like and subscribe!",
      type: "message",
    },
    {
      text: "Next flight: EK 231 from Dubai (DXB) - Expected arrival: 17:05",
      type: "flight",
    },
    {
      text: "Thanks to our channel members for your support!",
      type: "message",
    },
  ];

  const [currentFlight, setCurrentFlight] = useState<FlightData>(flightData[0]);
  const [currentWeather] = useState<WeatherData>(weatherData);
  const [currentTickerMessage, setCurrentTickerMessage] =
    useState<TickerMessage>(tickerMessages[0]);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [showWeather, setShowWeather] = useState<boolean>(true);
  const [commentaryOpacity, setCommentaryOpacity] = useState(1);
  const [currentCommentary, setCurrentCommentary] = useState<CommentaryData>(
    commentaryData[0]
  );

  const tickerRef = useRef<HTMLDivElement>(null);
  const commentaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setShowWeather((prev) => !prev);
    }, 10000);

    return () => {
      clearInterval(toggleInterval);
    };
  }, []);

  useEffect(() => {
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % airportStatuses.length;
    }, 20000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    let flightIndex = 0;
    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % flightData.length;
      setCurrentFlight(flightData[flightIndex]);
      setIsNewEntry(true);
      setTimeout(() => setIsNewEntry(false), 500);
    }, 8000);

    return () => clearInterval(flightInterval);
  }, []);

  useEffect(() => {
    let commentaryIndex = 0;
    const commentaryInterval = setInterval(() => {
      setCommentaryOpacity(0);
      setTimeout(() => {
        commentaryIndex = (commentaryIndex + 1) % commentaryData.length;
        setCurrentCommentary(commentaryData[commentaryIndex]);
        setCommentaryOpacity(1);
      }, 500);
    }, 12000);

    return () => clearInterval(commentaryInterval);
  }, []);

  useEffect(() => {
    let tickerIndex = 0;
    const tickerInterval = setInterval(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;

      if (tickerRef.current) {
        tickerRef.current.style.transform = "translateX(100%)";

        setTimeout(() => {
          setCurrentTickerMessage(tickerMessages[tickerIndex]);
          if (tickerRef.current) {
            const textWidth = tickerRef.current.offsetWidth;
            const containerWidth =
              tickerRef.current.parentElement?.offsetWidth || 0;
            const distance = textWidth + containerWidth;

            tickerRef.current.style.transition = "none";
            tickerRef.current.style.transform = "translateX(100%)";
            void tickerRef.current.offsetWidth;
            tickerRef.current.style.transition = "transform 15s linear";
            tickerRef.current.style.transform = `translateX(-${distance}px)`;
          }
        }, 100);
      }
    }, 15000);

    setTimeout(() => {
      if (tickerRef.current) {
        const textWidth = tickerRef.current.offsetWidth;
        const containerWidth =
          tickerRef.current.parentElement?.offsetWidth || 0;
        const distance = textWidth + containerWidth;

        tickerRef.current.style.transition = "transform 15s linear";
        tickerRef.current.style.transform = `translateX(-${distance}px)`;
      }
    }, 500);

    return () => clearInterval(tickerInterval);
  }, []);

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

  const formatOrigin = (origin: string) => {
    const parts = origin.split("(");
    if (parts.length === 2) {
      const city = parts[0].trim();
      const code = parts[1].replace(")", "");
      return (
        <>
          {city} <span className="font-bold text-stone-100">{code}</span>
        </>
      );
    }
    return origin;
  };

  return (
    <div className="w-full bg-slate-950 backdrop-blur-md border-2 border-sky-950 font-sans text-white shadow-[0_4px_20px_rgb(0_0_0/0.3)] rounded-lg">
      {/* Commentary Section */}
      <div className="relative h-8 border-b border-white/10 overflow-hidden">
        <div
          ref={commentaryRef}
          className="absolute inset-0 flex items-center px-4 text-sm font-medium transition-opacity duration-500"
          style={{ opacity: commentaryOpacity }}
        >
          <span className="mr-2 text-amber-400/80 italic">
            Live Commentary:
          </span>
          <span
            className={
              currentCommentary.type === "fact"
                ? "text-cyan-300"
                : currentCommentary.type === "aircraft"
                ? "text-lime-300"
                : "text-amber-300"
            }
          >
            {currentCommentary.text}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[60px] max-w-[1920px] mx-auto ">
        <div className="flex-1 flex flex-col p-[10px_20px] justify-center">
          <div
            className={`flex items-center ${
              isNewEntry ? "animate-[fadeIn_0.5s_ease-out]" : ""
            }`}
          >
            {/* Flight Number */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Flight
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-shadow-sm text-white">
                {currentFlight.flight}
              </div>
            </div>
            <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>

            {/* Origin */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Arriving From
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-shadow-sm text-white">
                {formatOrigin(currentFlight.origin)}
              </div>
            </div>
            <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>

            {/* Landed Time */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Landed
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-shadow-sm text-white">
                {currentFlight.landed}
              </div>
            </div>
            <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>

            {/* Runway */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Runway
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-shadow-sm text-white">
                {currentFlight.runway}
              </div>
            </div>
            <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>

            {/* Duration */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Duration
              </div>
              <div className="text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-shadow-sm text-white">
                {currentFlight.duration}
              </div>
            </div>
            <div className="w-px h-9 bg-gradient-to-b from-white/5 via-white/15 to-white/5 mx-[5px]"></div>

            {/* Status */}
            <div className="flex flex-col px-[10px] min-w-[120px] relative">
              <div className="text-[11px] text-[#b4b4b4]/90 mb-1 uppercase tracking-[0.5px] font-medium">
                Status
              </div>
              <div
                className={`text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis pl-4 relative ${
                  currentFlight.statusClass === "on-time"
                    ? "text-[#4ade80]"
                    : "text-[#fb7185]"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 text-[12px] ${
                    currentFlight.statusClass === "on-time"
                      ? "text-[#4ade80]"
                      : "text-[#fb7185]"
                  }`}
                >
                  ●
                </span>
                {currentFlight.status}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div className="w-[180px] bg-gradient-to-r from-white/5 to-white/10 border-l border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          <div
            className={`absolute inset-0 flex items-center p-[0_15px] transition-[opacity,transform] duration-500 ease-in-out ${
              showWeather
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[10px]"
            }`}
          >
            <div className="text-[32px] mr-3 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] animate-[float_3s_ease-in-out_infinite]">
              {getWeatherIcon(currentWeather.icon)}
            </div>
            <div className="flex flex-col">
              <div className="text-[20px] font-bold text-white">
                {currentWeather.temp}
              </div>
              <div className="text-[12px] text-[#b4b4b4] whitespace-nowrap">
                {currentWeather.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Section */}
      <div className="relative h-6 bg-slate-800 backdrop-blur-md border-t border-white/10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div
          ref={tickerRef}
          className={`absolute whitespace-nowrap text-[13px] font-medium py-[3px] translate-x-full flex items-center h-full ${
            currentTickerMessage.type === "flight"
              ? "text-sky-300"
              : "text-amber-200"
          }`}
        >
          <span className="mr-2 text-[14px] inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white/15">
            {currentTickerMessage.type === "flight" ? "✈️" : "📢"}
          </span>
          {currentTickerMessage.text}
        </div>
      </div>
    </div>
  );
}
