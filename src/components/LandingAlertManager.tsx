"use client";

import { useState, useEffect, useRef } from "react";
import { useLandingAircraft } from "@/hooks/useLandingAircraft";
import FlightApproachDisplay from "./FlightApproachDisplay";
import { LANDING_DEBUG_MODE, LANDING_DEBUG_LOG_PATH } from "@/constants/polling";
import { LandingStatus, writeLandingDebugLog } from "@/utils/debugLogger";

/**
 * LandingAlertManager Component
 * Manages the display of landing alerts based on aircraft data
 */
const LandingAlertManager: React.FC = () => {
  const { landingFlightData, isLoading, error, hasLandingAircraft } =
    useLandingAircraft();
  const [showAlert, setShowAlert] = useState(false);
  const [lastProcessedFlightId, setLastProcessedFlightId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        
        console.log("[LandingAlertManager] Airplane ding sound initialized");
      } catch (e) {
        console.error("[LandingAlertManager] Failed to initialize audio:", e);
      }
    }
  }, []);

  // Log when component mounts
  useEffect(() => {
    console.log("[LandingAlertManager] Component mounted");
    return () => {
      console.log("[LandingAlertManager] Component unmounted");
    };
  }, []);

  // When landing aircraft is detected, show the alert
  useEffect(() => {
    console.log("[LandingAlertManager] hasLandingAircraft:", hasLandingAircraft, "landingFlightData:", landingFlightData);
    
    if (hasLandingAircraft && landingFlightData) {
      // Create a unique ID for this flight
      const flightId = `${landingFlightData.airline}${landingFlightData.number}-${landingFlightData.registration || "unknown"}`;
      
      console.log("[LandingAlertManager] Detected landing:", flightId, "Last processed:", lastProcessedFlightId, "Data:", {
        altitude: landingFlightData.altitude,
        speed: landingFlightData.speed,
        verticalRate: landingFlightData.verticalRate,
        airline: landingFlightData.airline,
        number: landingFlightData.number,
        origin: landingFlightData.origin,
        originCode: landingFlightData.originCode,
        registration: landingFlightData.registration,
        flightTime: landingFlightData.flightTime
      });
      
      // Only show alert if this is a new flight
      if (lastProcessedFlightId !== flightId) {
        console.log("[LandingAlertManager] New flight detected, showing alert");
        setLastProcessedFlightId(flightId);
        setShowAlert(true);
        
        // Play the airplane ding sound
        try {
          if (audioRef.current) {
            console.log("[LandingAlertManager] Playing airplane ding sound");
            audioRef.current.currentTime = 0; // Reset to start
            audioRef.current.play().catch(e => {
              console.error("[LandingAlertManager] Error playing sound:", e);
            });
          }
        } catch (e) {
          console.error("[LandingAlertManager] Error playing airplane ding sound:", e);
        }
        
        // Log for debug panel correlation
        if (LANDING_DEBUG_MODE) {
          // Create a debug entry for the alert display
          const debugEntry = {
            hex: landingFlightData.registration || "unknown",
            flight: `${landingFlightData.airline}${landingFlightData.number}`,
            altitude: landingFlightData.altitude,
            speed: landingFlightData.speed,
            vertical_rate: landingFlightData.verticalRate,
            status: LandingStatus.ALERT_TRIGGERED,
            reason: "Alert component is being displayed",
            timestamp: new Date().toISOString()
          };
          // Write to debug log
          writeLandingDebugLog(LANDING_DEBUG_LOG_PATH, [debugEntry]);
          console.log("[DEBUG] Landing alert display triggered and logged");
        }
      } else {
        console.log("[LandingAlertManager] Skipping - same as last processed flight");
      }
    }
  }, [hasLandingAircraft, landingFlightData, lastProcessedFlightId]);

  // For debugging
  useEffect(() => {
    if (error) {
      console.error("Error in LandingAlertManager:", error);
    }
  }, [error]);
  
  // Add a reset mechanism to clear the last processed flight after a longer period
  useEffect(() => {
    if (lastProcessedFlightId) {
      const timer = setTimeout(() => {
        console.log("[LandingAlertManager] Resetting last processed flight");
        setLastProcessedFlightId(null);
      }, 300000); // 5 minute cooldown (300,000ms)
      
      return () => clearTimeout(timer);
    }
  }, [lastProcessedFlightId]);

  // Add a simple timeout to hide the alert after displaying it
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        console.log("[LandingAlertManager] Hiding alert after timeout");
        setShowAlert(false);
      }, 30000); // 30 seconds display time
      
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (isLoading) {
    // Don't render anything while loading
    return null;
  }

  if (error) {
    // Optionally render an error state
    console.error("Error in LandingAlertManager:", error);
    return null;
  }

  if (!showAlert || !landingFlightData) {
    // Don't render anything if there's no landing aircraft or alert is hidden
    return null;
  }

  return (
    <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center items-center">
      <FlightApproachDisplay flight={landingFlightData} />
    </div>
  );
};

export default LandingAlertManager;
