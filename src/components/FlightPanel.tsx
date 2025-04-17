// FlightPanel.tsx
"use client";

import { Flight } from "../types";

interface FlightPanelProps {
  currentFlight: Flight;
  isNewEntry: boolean;
}

export default function FlightPanel({
  currentFlight,
  isNewEntry,
}: FlightPanelProps) {
  const isArrival = currentFlight.type === "arrival";
  const city = isArrival
    ? currentFlight.origin_city
    : currentFlight.destination_city;
  const airportCode = isArrival
    ? currentFlight.origin
    : currentFlight.destination;
  const directionLabel = isArrival ? "Arriving From" : "Departing To";

  // New status/time configuration
  const timeLabel = isArrival ? "Landed" : "Status";
  const displayedTimeOrStatus = isArrival
    ? currentFlight.time
    : currentFlight.status;

  return (
    <div className="flex justify-center h-full bg-gradient-to-r from-blue-900 to-blue-950 p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-tr-[10px] rounded-br-[10px]">
      <div className="text-sky-50 flex items-center justify-between">
        <div className="flex-2 flex text-center flex-col justify-center">
          <div
            className={`flex text-center gap-1 md:gap-2 ${
              isNewEntry ? "animate-[fadeIn_0.5s_ease-out]" : ""
            }`}
          >
            {/* Flight Number */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                Flight
              </div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.flight_number}
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

            {/* Origin/Destination */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                {directionLabel}
              </div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {city || "Unknown City"}
                <span className="font-bold text-yellow-400 ml-1">
                  ({airportCode || "N/A"})
                </span>
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>
            {/* Status/Time */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                {timeLabel}
              </div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {displayedTimeOrStatus || currentFlight.time}
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white-5"></div>

            {/* Duration */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                {isArrival ? "Duration" : "Est. Time"}
              </div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.flight_time || currentFlight.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
