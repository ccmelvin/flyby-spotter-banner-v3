// FlightPanel.tsx
"use client";

import { Flight } from "../types";

interface FlightPanelProps {
  currentFlight: Flight;
  isNewEntry: boolean;
}

export default function FlightPanel({ currentFlight, isNewEntry }: FlightPanelProps) {
  return (
    <div className="h-full bg-gradient-to-r from-blue-900 to-blue-950 p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] backdrop-blur-md rounded-tr-[10px] rounded-br-[10px]">
      <div className="text-sky-50 flex items-center justify-between">
        <div className="flex-1 flex flex-col justify-center">
          <div className={`flex items-center gap-1 md:gap-2 ${isNewEntry ? "animate-[fadeIn_0.5s_ease-out]" : ""}`}>
            {/* Flight Number */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Flight</div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.flight_number}
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

            {/* Origin */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">
                Arriving From
              </div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.origin_city} <span className="font-bold text-yellow-400">{currentFlight.origin}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

            {/* Landed Time */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Landed</div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.time}
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

            {/* Duration */}
            <div className="flex flex-col px-2 min-w-auto relative">
              <div className="text-xs text-sky-300 mb-1 uppercase tracking-wider font-medium">Duration</div>
              <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {currentFlight.flight_time}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
