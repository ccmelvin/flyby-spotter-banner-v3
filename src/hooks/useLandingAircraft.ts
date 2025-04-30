// src/hooks/useLandingAircraft.ts
import { useState, useEffect } from "react";
import { Aircraft } from "@/types";
import aircraftDataService from "@/services/AircraftDataService";
import { AIRLINE_LOGOS, getValidAirlineCode } from "@/constants/airlines";

// Define the shape of the flight data we'll provide to components
export interface LandingFlightData {
  title: string;
  number: string;
  airline: keyof typeof AIRLINE_LOGOS;
  origin: string;
  runway: string;
  originCode: string;
  registration: string;
  altitude: number;
  speed: number;
  verticalRate: number;
  flightTime?: string;
}

/**
 * Hook to detect and provide landing aircraft data
 * @returns Object containing landing aircraft data and status
 */
export function useLandingAircraft() {
  const [landingAircraft, setLandingAircraft] = useState<Aircraft | null>(null);
  const [landingFlightData, setLandingFlightData] =
    useState<LandingFlightData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Start polling for aircraft data when the component mounts
  useEffect(() => {
    console.log("Starting aircraft data polling");
    setIsLoading(true);

    try {
      // Start polling for aircraft data
      aircraftDataService.startPolling();

      // Set up listener for landing events
      const unsubscribe = aircraftDataService.addListener((event, data) => {
        if (event === "landing") {
          console.log("Landing aircraft detected:", data);
          setLandingAircraft(data);

          // Convert the aircraft data to the format expected by FlightApproachDisplay
          if (data) {
            const flightInfo = data.flightInfo;

            console.log("Flight info for landing aircraft:", flightInfo);

            // Get airline code - try from flightInfo first, then from flight number
            let airlineCode: string;

            if (flightInfo?.airline) {
              // Use airline code from flight info if available
              airlineCode = flightInfo.airline;
              console.log("Using airline code from flightInfo:", airlineCode);
            } else if (data.flight) {
              // Extract from flight number (e.g., "DAL1234" -> "DAL")
              // Most flight numbers have 3-letter airline code followed by numbers
              const match = data.flight.trim().match(/^([A-Z]{3})\d+/i);
              airlineCode = match ? match[1].toUpperCase() : "UNKNOWN";
              console.log(
                "Extracted airline code from flight number:",
                airlineCode
              );
            } else {
              // Default to UNKNOWN if no flight code
              airlineCode = "UNKNOWN";
              console.log("No airline code found, using default:", airlineCode);
            }

            console.log("Extracted airline code:", airlineCode);

            // Make sure the airline code is one we have a logo for
            const validAirlineCode = getValidAirlineCode(airlineCode);
            console.log("Valid airline code for logo:", validAirlineCode);

            // Extract flight number without airline code
            let flightNumber = "Unknown";
            if (data.flight) {
              const match = data.flight.trim().match(/^[A-Z]{3}(\d+)/i);
              flightNumber = match ? match[1] : data.flight.trim();
              console.log(
                "Extracted flight number from data.flight:",
                flightNumber
              );
            } else if (flightInfo?.flight_number) {
              const match = flightInfo.flight_number.match(/^[A-Z]{3}(\d+)/i);
              flightNumber = match ? match[1] : flightInfo.flight_number;
              console.log(
                "Extracted flight number from flightInfo:",
                flightNumber
              );
            }

            console.log("Final flight number:", flightNumber);

            // Create a mock flight for testing if no flight info is available
            if (!flightInfo) {
              console.log(
                "No flight info found, creating mock data for testing"
              );

              // Create landing flight data with mock values
              const mockLandingData: LandingFlightData = {
                title: "Upcoming Landing",
                number: data.flight?.trim() || "12345",
                airline: "DAL",
                origin: "Atlanta",
                runway: "Approaching",
                originCode: "ATL",
                registration: data.r || "N12345",
                altitude: typeof data.alt_baro === "number" ? data.alt_baro : 0,
                speed: data.gs || 0,
                verticalRate: data.baro_rate || 0,
                flightTime: "2h 15m",
              };

              console.log("Setting mock landing flight data:", mockLandingData);
              setLandingFlightData(mockLandingData);
              setIsLoading(false);
              return;
            }

            const newLandingFlightData = {
              title: "Upcoming Landing",
              number: flightNumber,
              airline: validAirlineCode,
              origin: flightInfo?.origin_city || "Unknown",
              runway: "Approaching",
              originCode: flightInfo?.origin || "???",
              registration: data.r || flightInfo?.registration || "Unknown",
              altitude: typeof data.alt_baro === "number" ? data.alt_baro : 0,
              speed: data.gs || 0,
              verticalRate: data.baro_rate || 0,
              flightTime: flightInfo?.flight_time || "N/A",
            };

            console.log("Setting landing flight data:", newLandingFlightData);
            setLandingFlightData(newLandingFlightData);

            console.log("Landing flight data set:", {
              airline: validAirlineCode,
              number: flightNumber,
              origin: flightInfo?.origin_city,
              originCode: flightInfo?.origin,
              flightTime: flightInfo?.flight_time,
            });
          }

          setIsLoading(false);
        }
      });

      // Clean up on unmount
      return () => {
        console.log("Stopping aircraft data polling");
        aircraftDataService.stopPolling();
        unsubscribe();
      };
    } catch (err) {
      console.error("Error in useLandingAircraft hook:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsLoading(false);
    }
  }, []);

  return {
    landingAircraft,
    landingFlightData,
    isLoading,
    error,
    hasLandingAircraft: !!landingAircraft,
  };
}
