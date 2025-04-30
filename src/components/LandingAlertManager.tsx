"use client";

import { useState, useEffect } from "react";
import { useLandingAircraft } from "@/hooks/useLandingAircraft";
import FlightApproachDisplay from "./FlightApproachDisplay";

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
