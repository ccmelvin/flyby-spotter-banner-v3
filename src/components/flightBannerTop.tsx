"use client"

import { Wind, Eye, Layers } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface FlightData {
  flight: string
  origin: string
  landed: string
  runway: string
  duration: string
  status: string
  statusClass: "on-time" | "delayed"
}

interface AirportDisplayProps {
  airportCode?: string
  airportName?: string
  location?: string
  conditions?: string
  temperature?: number
  windDirection?: number
  windSpeed?: number
  timeZone?: "east" | "west"
  city?: string
  vis?: string
  ceiling?: string
  icon?: string
  temp?: string
}

interface WeatherData {
  temp: string
  condition: string
  icon: string
  city: string
  wind: string
  ceiling: string
  visibility: string
}

export default function FlightBannerTop({
  airportCode = "RDU / KRDU",
  airportName = "Raleigh-Durham International Airport",
  location = "North Carolina, USA",

  windDirection = 270,
  windSpeed = 10,

}: AirportDisplayProps) {
  const [activeBox, setActiveBox] = useState<"yellow" | "blue">("yellow")
  const [isAnimating, setIsAnimating] = useState(false)
  const [position, setPosition] = useState<"offscreen" | "center" | "exit">("offscreen")

  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(isPaused)

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
  ]

  const [currentFlight, setCurrentFlight] = useState<FlightData>(flightData[0])
  const [isNewEntry, setIsNewEntry] = useState(false)

  useEffect(() => {
    let flightIndex = 0
    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % flightData.length
      setCurrentFlight(flightData[flightIndex])
      setIsNewEntry(true)
      setTimeout(() => setIsNewEntry(false), 500)
    }, 8000)

    return () => clearInterval(flightInterval)
  }, [])

  const formatOrigin = (origin: string) => {
    const parts = origin.split("(")
    if (parts.length === 2) {
      const city = parts[0].trim()
      const code = parts[1].replace(")", "")
      return (
        <>
          {city} <span className="font-bold text-yellow-400">{code}</span>
        </>
      )
    }
    return origin
  }

  // Keep ref updated
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  // useEffect(() => {
  //   let isMounted = true;

  //   const animateBoxes = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 3000));

  //     while (isMounted) {
  //       setActiveBox("yellow");
  //       setPosition("offscreen");
  //       await new Promise((resolve) => setTimeout(resolve, 100));
  //       setIsAnimating(true);
  //       setPosition("center");
  //       await new Promise((resolve) => setTimeout(resolve, 3000));
  //       setPosition("exit");
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       setActiveBox("blue");
  //       setPosition("offscreen");
  //       await new Promise((resolve) => setTimeout(resolve, 100));
  //       setPosition("center");
  //       await new Promise((resolve) => setTimeout(resolve, 3000));
  //       setPosition("exit");
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }
  //   };

  //   animateBoxes();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  useEffect(() => {
    let isMounted = true

    const animateBoxes = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      while (isMounted) {
        // Pause check
        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setActiveBox("yellow")
        setPosition("offscreen")
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Pause check
        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setIsAnimating(true)
        setPosition("center")
        await new Promise((resolve) => setTimeout(resolve, 10000))

        // Pause check
        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setPosition("exit")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Repeat same pattern for blue section
        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setActiveBox("blue")
        setPosition("offscreen")
        await new Promise((resolve) => setTimeout(resolve, 100))

        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setPosition("center")
        await new Promise((resolve) => setTimeout(resolve, 10000))

        while (isPausedRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        setPosition("exit")
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    animateBoxes()

    return () => {
      isMounted = false
    }
  }, [])

  const getTransformClass = () => {
    switch (position) {
      case "offscreen":
        return "-translate-x-full"
      case "center":
        return "translate-x-0"
      case "exit":
        return "-translate-x-full"
      default:
        return "translate-x-full"
    }
  }
  const weatherData: WeatherData = {
    temp: "72°F",
    condition: "Partly Cloudy",
    icon: "partly_cloudy_day",
    city: "Raleigh",
    wind: "8kt 240°",
    visibility: "10SM",
    ceiling: "BKN035",
  }

  return (
    <div className="flex flex-col md:flex-row relative rounded-l-[5px]  ">
      {/* temp button to pause the animation */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-0 right-0 z-50 p-2 bg-blue-950 text-white rounded-bl-lg"
      >
        {isPaused ? "▶ Resume" : "⏸ Pause"}
      </button>

      {/* Left section - Airport info */}
      <div className="bg-white border-l-2 border-[#F66A6F] p-2 md:w-auto max-w-auto overflow-hidden  shadow-lg">
        <div className="text-slate-700 text-[17px]  ">{airportCode}</div>

        <h1 className="text-[25px] md:text-1xl font-bold text-slate-700">{airportName}</h1>
        <div className="text-slate-700 text-[17px] mr-3">{location}</div>
      </div>

      {/* Right section - Dynamic content box */}
      <div className="relative overflow-hidden inline-flex">
        <div className={`transition-transform duration-1000 ease-in-out transform ${getTransformClass()}`}>
          {activeBox === "yellow" ? (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-7 md:p-[auto] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-r-[10px]">
              <div className="text-stone-100 flex items-center justify-between gap-4">
                <div className="flex flex-col border-r border-amber-400/50 pr-4 md:pr-4">
                  <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
                    <Wind className="h-5 w-5 mr-2 text-blue-800" />
                    Wind
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-950 font-semibold text-lg">
                      {windDirection}° {windSpeed}kts
                    </span>
                  </div>
                </div>
                <div className="flex flex-col border-r border-amber-400/50 pr-4 md:pr-6">
                  <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
                    <Eye className="h-5 w-5 mr-2 text-blue-800" />
                    VIS
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-950 font-semibold text-lg">{weatherData.visibility}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center uppercase text-[14px] text-blue-800 mb-1 font-medium">
                    <Layers className="h-5 w-5 mr-2 text-blue-800" />
                    CEILING
                  </div>
                  <div className="text-blue-950 font-semibold text-lg">{weatherData.ceiling}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-8 md:p-[auto] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden rounded-r-[10px]">
              <div className="text-sky-50 flex items-center justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div
                    className={`flex items-center gap-1 md:gap-2 ${isNewEntry ? "animate-[fadeIn_0.5s_ease-out]" : ""}`}
                  >
                    {/* Flight Number */}
                    <div className="flex flex-col px-2 min-w-auto relative">
                      <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Flight</div>
                      <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                        {currentFlight.flight}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

                    {/* Origin */}
                    <div className="flex flex-col px-2 min-w-auto relative">
                      <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                        Arriving From
                      </div>
                      <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                        {formatOrigin(currentFlight.origin)}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

                    {/* Landed Time */}
                    <div className="flex flex-col px-2 min-w-auto relative">
                      <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Landed</div>
                      <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                        {currentFlight.landed}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

                    {/* Duration */}
                    <div className="flex flex-col px-2 min-w-auto relative">
                      <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Duration</div>
                      <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                        {currentFlight.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
