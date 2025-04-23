"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AIRLINE_LOGOS } from "@/constants/airlines";

interface Flight {
  title: string;
  number: string;
  airline: keyof typeof AIRLINE_LOGOS;
  origin: string;
  runway: string;
  originCode: string;
  registration: string;
}

interface FlightApproachDisplayProps {
  flight: Flight;
}

// Helper function to get airline full name from code
const getAirlineName = (code: string): string => {
  const airlineNames: Record<string, string> = {
    DAL: "Delta AirLines",
    UAL: "United Airlines",
    AAL: "American Airlines",
    SWA: "Southwest Airlines",
    DHL: "DHL Aviation",
  };

  return airlineNames[code] || code;
};

export default function FlightApproachDisplay({ flight }: FlightApproachDisplayProps) {
  const [animationState, setAnimationState] = useState("hidden"); // "hidden", "entering", "visible", "exiting"
  
  useEffect(() => {
    // Initial delay before starting the appearance animation
    const initialDelay = setTimeout(() => {
      // Start entering animation
      setAnimationState("entering");
      
      // After entering animation completes, set to visible
      const visibleDelay = setTimeout(() => {
        setAnimationState("visible");
        
        // After being visible for a while, start exiting animation
        const exitDelay = setTimeout(() => {
          setAnimationState("exiting");
          
          // Reset to hidden after a while to restart the cycle
          const resetDelay = setTimeout(() => {
            setAnimationState("hidden");
          
          }, 1000); // Time to complete exit animation
          
          return () => clearTimeout(resetDelay);
        }, 5000); // Time to stay visible
        
        return () => clearTimeout(exitDelay);
      }, 1000); // Time to complete entering animation
      
      return () => clearTimeout(visibleDelay);
    }, 2000); // Initial delay before animation starts
    
    return () => clearTimeout(initialDelay);
  }, []);
  
  // Add null check to prevent errors when flight is undefined
  if (!flight) {
    return null;
  }

  // Get the full airline name for display
  const airlineName = getAirlineName(flight.airline);
  
  // Animation classes based on the current state
  const cardAnimationClass = 
    animationState === "hidden" ? "translate-y-24 opacity-0 pointer-events-none" :
    animationState === "entering" ? "translate-y-0 opacity-100" :
    animationState === "visible" ? "translate-y-0 opacity-100" :
    "translate-y-24 opacity-0"; // exiting

  return (
    <div className="  left-0 right-0 flex justify-center items-center z-[100]">
      <Card 
        className={`max-w-md overflow-hidden shadow-lg border-0 rounded-[10px] transition-all duration-1000 ease-in-out ${cardAnimationClass}`}
      >
        <div className="bg-blue-950 text-white font-bold border-b-[1px] border-blue-800 uppercase p-2 flex justify-center items-center">
          {flight.title}
        </div>
        <div className="text-blue-900 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 rotate-45" />
            <span className="text-lg text-blue-800">
              {airlineName} {flight.number}
            </span>
          </div>
          <div className="rounded-[5px] p-1 flex items-center justify-center h-45 w-45">
            <Image
              src={AIRLINE_LOGOS[flight.airline]}
              alt={`${flight.airline} logo`}
              width={70}
              height={60}
              className="rounded-full"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        {/* Flight information */}
        <div className="p-4 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#0039A6] rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium text-blue-800">
                {flight.origin} – {flight.originCode}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Aircraft</p>
              <p className="font-medium text-blue-800">{flight.registration}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600">Approaching</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-sm text-gray-500">Runway</p>
              <p className="font-medium text-blue-800">{flight.runway}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Tracking</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}