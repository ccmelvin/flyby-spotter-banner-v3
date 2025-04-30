"use client";

import { useState, useEffect } from "react";
import { useLandingAircraft } from "@/hooks/useLandingAircraft";
import FlightApproachDisplay from "./FlightApproachDisplay";
import { LANDING_DEBUG_MODE } from "@/constants/polling";
import { LandingStatus, writeLandingDebugLog } from "@/utils/debugLogger";

/**
 * LandingAlertManager Component
 * Manages the display of landing alerts based on aircraft data
 */
const LandingAlertManager: React.FC = () => {
  const { landingFlightData, isLoading, error, hasLandingAircraft } =
    useLandingAircraft();
  const [showAlert, setShowAlert] = useState(false);

  // When landing aircraft is detected, show the alert
  useEffect(() => {
    if (hasLandingAircraft && landingFlightData) {
      console.log("Showing landing alert for:", landingFlightData);
      setShowAlert(true);
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
        writeLandingDebugLog("/landing-debug-display.json", [debugEntry]);
        console.log("[DEBUG] Landing alert display triggered and logged");
      }
    }
  }, [hasLandingAircraft, landingFlightData]);

  // For debugging
  useEffect(() => {
    if (error) {
      console.error("Error in LandingAlertManager:", error);
    }
  }, [error]);

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
    <div className="fixed bottom-10 left-0 right-0 z-50">
      <FlightApproachDisplay flight={landingFlightData} />
    </div>
  );
};

export default LandingAlertManager;
