"use client";

import { useState, useEffect, useRef } from "react";
import FlightApproachDisplay from "@/components/FlightApproachDisplay";
import { LandingFlightData, useLandingAircraft } from "@/hooks/useLandingAircraft";
import { api } from "@/app/services/api";

// Mock flight data for testing
const mockFlightData: LandingFlightData = {
  title: "Upcoming Landing",
  number: "1234",
  airline: "DAL",
  origin: "Atlanta",
  runway: "Approaching",
  originCode: "ATL",
  registration: "N12345",
  altitude: 800,
  speed: 150,
  verticalRate: -500,
  flightTime: "2h 15m",
};

export default function LandingAlertPage() {
  const [useRealData, setUseRealData] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const { landingFlightData, isLoading, error, hasLandingAircraft } = useLandingAircraft();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Set RDU as the current airport when the component mounts
  useEffect(() => {
    console.log("[LandingAlertPage] Setting current airport to RDU");
    api.setCurrentAirportCode("RDU");
  }, []);

  // Initialize audio element with airplane ding sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create a simple HTML5 Audio element with the downloaded MP3 file
        const audio = new Audio('/airplane-ding.mp3');
        
        // Configure audio settings
        audio.volume = 0.7; // Set volume to 70%
        audio.preload = 'auto'; // Preload the audio file
        
        // Store the audio element in the ref
        audioRef.current = audio;
        
        console.log("[LandingAlertPage] Airplane ding sound initialized");
      } catch (e) {
        console.error("[LandingAlertPage] Failed to initialize audio:", e);
      }
    }
  }, []);
  
  // Debug logging for landing aircraft data
  useEffect(() => {
    if (useRealData) {
      console.log("[LandingAlertPage] Landing aircraft state:", {
        hasLandingAircraft,
        landingFlightData,
        isLoading,
        error,
        currentAirport: api.getCurrentAirportCode()
      });
    }
  }, [useRealData, hasLandingAircraft, landingFlightData, isLoading, error]);

  // Play sound when alert is shown
  const playSound = () => {
    try {
      if (audioRef.current) {
        console.log("[LandingAlertPage] Playing airplane ding sound");
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play().catch(e => {
          console.error("[LandingAlertPage] Error playing sound:", e);
        });
      }
    } catch (e) {
      console.error("[LandingAlertPage] Error playing airplane ding sound:", e);
    }
  };

  // Toggle the alert
  const toggleAlert = () => {
    setShowAlert(!showAlert);
    if (!showAlert) {
      playSound();
    }
  };
  
  // Toggle real data
  const toggleRealData = () => {
    const newValue = !useRealData;
    setUseRealData(newValue);
    
    if (newValue) {
      // When enabling real data, ensure we're set to RDU
      console.log("[LandingAlertPage] Enabling real aircraft data for RDU");
      api.setCurrentAirportCode("RDU");
    }
  };

  // Determine which flight data to use
  const flightData = useRealData && landingFlightData ? landingFlightData : mockFlightData;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">Landing Alert Demo</h1>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useRealData"
              checked={useRealData}
              onChange={toggleRealData}
              className="h-4 w-4"
            />
            <label htmlFor="useRealData" className="text-gray-700">
              Use real aircraft data
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showAlert"
              checked={showAlert}
              onChange={toggleAlert}
              className="h-4 w-4"
            />
            <label htmlFor="showAlert" className="text-gray-700">
              Show landing alert
            </label>
          </div>
          
          <button
            onClick={() => {
              setShowAlert(true);
              playSound();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Trigger Alert with Sound
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Current Status:</h2>
          <p><span className="font-semibold">Data Source:</span> {useRealData ? 'Real Aircraft Data' : 'Mock Data'}</p>
          <p><span className="font-semibold">Alert Visible:</span> {showAlert ? 'Yes' : 'No'}</p>
          {useRealData && (
            <>
              <p><span className="font-semibold">Real Aircraft Available:</span> {hasLandingAircraft ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Loading:</span> {isLoading ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Airport Code:</span> {api.getCurrentAirportCode() || 'Not set'}</p>
              {error && <p className="text-red-500">Error: {error.message}</p>}
            </>
          )}
        </div>
      </div>
      
      {/* Landing Alert Display */}
      <div className="relative h-[500px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        {showAlert && flightData && (
          <div className="absolute">
            <FlightApproachDisplay flight={flightData} />
          </div>
        )}
        {!showAlert && (
          <div className="text-gray-500 text-center">
            <p>Alert is hidden</p>
            <p className="text-sm">Toggle the checkbox above to show it</p>
          </div>
        )}
      </div>
    </div>
  );
}
