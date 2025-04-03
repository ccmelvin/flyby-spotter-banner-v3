"use client"

import { Moon, Wind } from "lucide-react"
import { useEffect, useState } from "react"

interface AirportDisplayProps {
  airportCode?: string
  airportName?: string
  location?: string
  conditions?: string
  temperature?: number
  windDirection?: number
  windSpeed?: number
}

export default function FlightBanner3({
  airportCode = "LHR",
  airportName = "London Heathrow",
  location = "London, United Kingdom",
  conditions = "Clear",
  temperature = 18,
  windDirection = 270,
  windSpeed = 8,
}: AirportDisplayProps) {
  // State to track which box is currently visible
  const [activeBox, setActiveBox] = useState<"yellow" | "blue">("yellow")
  const [isAnimating, setIsAnimating] = useState(false)
  const [position, setPosition] = useState<"offscreen" | "center" | "exit">("offscreen")

  // Animation sequence
  useEffect(() => {
    let isMounted = true

    const animateBoxes = async () => {
      // Initial delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      while (isMounted) {
        // Show yellow box
        setActiveBox("yellow")
        setPosition("offscreen")
        
        // Small delay before animation
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        // Animate in
        setIsAnimating(true)
        setPosition("center")

        // Stay visible
        await new Promise((resolve) => setTimeout(resolve, 4000))

        // Animate out
        setPosition("exit")
        
        // Wait for exit animation to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Switch to blue box
        setActiveBox("blue")
        setPosition("offscreen")
        
        // Small delay before animation
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        // Animate in
        setPosition("center")
        
        // Stay visible
        await new Promise((resolve) => setTimeout(resolve, 4000))
        
        // Animate out
        setPosition("exit")
        
        // Wait for exit animation to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    animateBoxes()

    return () => {
      isMounted = false
    }
  }, [])

  // Get the appropriate transform class based on position
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

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row relative">
        {/* Left section - Airport info (static) */}
        <div className="bg-white p-4 md:p-6 md:w-1/2 z-10">
          <div className="text-gray-700 font-medium">{airportCode}</div>
          <h1 className="text-2xl md:text-1xl font-bold text-black">{airportName}</h1>
          <div className="text-gray-700">{location}</div>
        </div>

        {/* Right section - Content box with animation */}
        <div className="md:w-1/2 relative overflow-hidden">
          {/* Yellow Box */}
          {activeBox === "yellow" && (
            <div
              className={`absolute inset-0 bg-amber-400 p-5 md:p-6 transition-transform duration-1000 ease-in-out transform ${getTransformClass()}`}
            >
              <div className="text-stone-100 flex items-center justify-between">
                <div className="flex flex-col items-center border-r border-gray-800 pr-4 md:pr-6">
                  <div className="uppercase text-xs md:text-lg text-stone-800 mb-1">Conditions</div>
                  <div className="flex items-center text-sky-950">
                    <Moon className="h-5 w-5 mr-2" />
                    <span>{conditions}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center border-r border-gray-600 px-4 md:px-6">
                  <div className="uppercase text-xs md:text-lg text-stone-800 mb-1">Temperature</div>
                  <div className="text-xl md:text-2xl text-sky-950">
                    {temperature}°<span className="text-lg">c</span>
                  </div>
                </div>

                <div className="flex flex-col items-center pl-4 md:pl-6">
                  <div className="uppercase text-xs md:text-lg text-stone-800 mb-1">Wind</div>
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 mr-2 transform rotate-45 text-sky-950" />
                    <span className="text-lg md:text-base text-sky-950">
                      {windDirection}° {windSpeed}kts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blue Box */}
          {activeBox === "blue" && (
            <div
              className={`absolute inset-0 bg-sky-950 p-5 md:p-6 transition-transform duration-1000 ease-in-out transform ${getTransformClass()}`}
            >
              <div className="text-stone-100 flex items-center justify-between">
                <div className="flex flex-col items-center border-r border-gray-400 pr-4 md:pr-6">
                  <div className="uppercase text-xs md:text-lg text-neutral-200 mb-1">Local Time</div>
                  <div className="flex items-center text-neutral-200">
                    <span className="text-xl md:text-2xl">12:00pm</span>
                  </div>
                </div>

                <div className="flex flex-col items-center border-r border-gray-400 px-4 md:px-6">
                  <div className="uppercase text-xs md:text-lg text-neutral-200 mb-1">Fahrenheit</div>
                  <div className="text-xl md:text-2xl text-neutral-200">
                    {Math.round(temperature * 9/5 + 32)}°<span className="text-lg">F</span>
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
