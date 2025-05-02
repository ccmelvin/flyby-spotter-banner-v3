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
          console.log("[useLandingAircraft] Landing aircraft detected:", data);
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
              console.log("Raw flight data for airline extraction:", {
                flight: data.flight,
                registration: data.r,
                hex: data.hex
              });
              
              // Special handling for N-numbers (private aircraft)
              if (data.flight.trim().match(/^N\d+[A-Z]*\s*$/i)) {
                console.log("Detected N-number (private aircraft):", data.flight.trim());
                airlineCode = "PRIVATE";
                
                // Log aircraft type if available
                if (data.t) {
                  console.log("Aircraft type for private aircraft:", data.t);
                }
              }
              // Check if flight number starts with a known airline code
              else {
                const knownAirlineCodes = ["DAL", "UAL", "AAL", "SWA", "DHL", "EDV"];
                let foundCode = false;
                
                for (const code of knownAirlineCodes) {
                  if (data.flight.trim().startsWith(code)) {
                    airlineCode = code;
                    foundCode = true;
                    console.log(`Found known airline code at start of flight number: ${airlineCode}`);
                    break;
                  }
                }
                
                if (!foundCode) {
                  // Extract from flight number (e.g., "DAL1234" -> "DAL")
                  const match = data.flight.trim().match(/^([A-Z]{3})\d+/i);
                  airlineCode = match ? match[1].toUpperCase() : "UNKNOWN";
                  console.log("Extracted airline code from flight number:", airlineCode);
                }
              }
            } else {
              // Default to UNKNOWN if no flight code
              airlineCode = "UNKNOWN";
              console.log("No airline code found, using default:", airlineCode);
            }

            console.log("Extracted airline code:", airlineCode);

            // Make sure the airline code is one we have a logo for
            let validAirlineCode = getValidAirlineCode(airlineCode);
            
            // Special handling for EDV (Endeavor Air) - it's a Delta Connection carrier
            if (airlineCode === "EDV") {
              console.log("Handling Endeavor Air as a Delta Connection carrier");
              // We'll keep the EDV code if we have a logo for it, otherwise use DAL
              if (validAirlineCode === "UNKNOWN") {
                validAirlineCode = "EDV";
              }
            }
            
            console.log("Valid airline code for logo:", validAirlineCode);

            // Extract flight number without airline code
            let flightNumber = "N/A";
            if (data.flight) {
              // Try to match standard airline code + number format (e.g., DAL1234)
              const standardMatch = data.flight.trim().match(/^[A-Z]{3}(\d+)/i);
              if (standardMatch) {
                flightNumber = standardMatch[1];
                console.log("Extracted standard flight number format:", flightNumber);
              } else {
                // For non-standard formats, check if it's a valid commercial flight number
                // Commercial flight numbers are typically just numbers, sometimes with a letter
                const commercialMatch = data.flight.trim().match(/(\d{1,4}[A-Z]?)/i);
                if (commercialMatch) {
                  flightNumber = commercialMatch[1];
                  console.log("Extracted commercial flight number:", flightNumber);
                } else {
                  // If we can't extract a valid flight number, use N/A
                  flightNumber = "N/A";
                  console.log("Could not extract valid flight number, using N/A");
                }
              }
            } else if (flightInfo?.flight_number) {
              // Same logic for flightInfo.flight_number
              const standardMatch = flightInfo.flight_number.match(/^[A-Z]{3}(\d+)/i);
              if (standardMatch) {
                flightNumber = standardMatch[1];
                console.log("Extracted standard flight number from flightInfo:", flightNumber);
              } else {
                const commercialMatch = flightInfo.flight_number.match(/(\d{1,4}[A-Z]?)/i);
                if (commercialMatch) {
                  flightNumber = commercialMatch[1];
                  console.log("Extracted commercial flight number from flightInfo:", flightNumber);
                }
              }
            }

            console.log("Final flight number:", flightNumber);

            // Create a flight data object when no flight info is available
            if (!flightInfo) {
              console.log(
                "No flight info found, creating basic flight data"
              );

              // Extract a clean flight number or use N/A
              const cleanFlightNumber = flightNumber !== "N/A" ? flightNumber : "N/A";

              // Determine appropriate display values based on aircraft type
              let originDisplay = "Private Flight";
              let flightTimeDisplay = "Private Flight";
              
              // For N-numbers, it's likely a private aircraft
              if (data.flight && data.flight.trim().match(/^N\d+[A-Z]*\s*$/i)) {
                validAirlineCode = "PRIVATE";
                
                // Extract aircraft type if available
                if (data.t) {
                  console.log("Aircraft type information:", data.t);
                  
                  // Extract just the model name from the type string
                  // Common formats: "P28A" (Piper PA-28), "C172" (Cessna 172), etc.
                  let aircraftModel = "";
                  
                  // Map of common aircraft type codes to readable names
                  const aircraftTypes: Record<string, string> = {
                    "P28": "Piper PA-28",
                    "P32": "Piper PA-32",
                    "C172": "Cessna 172",
                    "C152": "Cessna 152",
                    "C182": "Cessna 182",
                    "BE20": "Beechcraft King Air",
                    "BE36": "Beechcraft Bonanza",
                    "BE58": "Beechcraft Baron",
                    "PA44": "Piper Seminole"
                  };
                  
                  // Try to match the type code
                  for (const [code, name] of Object.entries(aircraftTypes)) {
                    if (data.t.includes(code)) {
                      aircraftModel = name;
                      break;
                    }
                  }
                  
                  // If we found a model, use it for origin display
                  if (aircraftModel) {
                    originDisplay = `Local Flight (${aircraftModel})`;
                    flightTimeDisplay = "Local Training";
                    console.log("Using aircraft model for origin display:", originDisplay);
                  }
                }
              }
              
              // Create landing flight data with available values
              const basicLandingData: LandingFlightData = {
                title: "Upcoming Landing",
                number: cleanFlightNumber,
                airline: validAirlineCode,
                origin: originDisplay,
                runway: "Approaching",
                originCode: "",
                registration: data.r || "N/A",
                altitude: typeof data.alt_baro === "number" ? data.alt_baro : 0,
                speed: data.gs || 0,
                verticalRate: data.baro_rate || 0,
                flightTime: flightTimeDisplay,
              };

              console.log("Setting basic landing flight data:", basicLandingData);
              setLandingFlightData(basicLandingData);
              setIsLoading(false);
              return;
            }

            // Determine origin display based on airline code and flight info
            let originDisplay = "Unknown";
            let originCodeDisplay = "";
            let flightTimeDisplay = "N/A";
            
            // Log flight info for debugging
            console.log("Flight info for origin/duration:", {
              flightInfo,
              validAirlineCode,
              flight: data.flight,
              registration: data.r,
              type: data.t
            });
            
            if (flightInfo) {
              originDisplay = flightInfo.origin_city || "Unknown";
              originCodeDisplay = flightInfo.origin || "";
              flightTimeDisplay = flightInfo.flight_time || "N/A";
              console.log("Using flight info for origin/duration:", {
                origin: originDisplay,
                originCode: originCodeDisplay,
                flightTime: flightTimeDisplay
              });
            } else if (validAirlineCode === "PRIVATE") {
              // For private aircraft, check if we can extract aircraft type
              if (data.t) {
                console.log("Aircraft type information for private aircraft:", data.t);
                
                // Extract just the model name from the type string
                // Common formats: "P28A" (Piper PA-28), "C172" (Cessna 172), etc.
                let aircraftModel = "";
                
                // Map of common aircraft type codes to readable names
                const aircraftTypes: Record<string, string> = {
                  "P28": "Piper PA-28",
                  "P32": "Piper PA-32",
                  "C172": "Cessna 172",
                  "C152": "Cessna 152",
                  "C182": "Cessna 182",
                  "BE20": "Beechcraft King Air",
                  "BE36": "Beechcraft Bonanza",
                  "BE58": "Beechcraft Baron",
                  "PA44": "Piper Seminole"
                };
                
                // Try to match the type code
                for (const [code, name] of Object.entries(aircraftTypes)) {
                  if (data.t.includes(code)) {
                    aircraftModel = name;
                    break;
                  }
                }
                
                // If we found a model, use it for origin display
                if (aircraftModel) {
                  originDisplay = `Local Flight (${aircraftModel})`;
                  flightTimeDisplay = "Local Training";
                  console.log("Using aircraft model for origin display:", originDisplay);
                } else {
                  originDisplay = "Private Flight";
                  originCodeDisplay = "";
                }
              } else {
                originDisplay = "Private Flight";
                originCodeDisplay = "";
              }
            } else {
              // For commercial flights without flight info, try to provide better defaults
              if (["DAL", "UAL", "AAL", "SWA", "EDV"].includes(validAirlineCode)) {
                // Use airline name to create a more informative origin
                const airlineNames: Record<string, string> = {
                  "DAL": "Delta",
                  "UAL": "United",
                  "AAL": "American",
                  "SWA": "Southwest",
                  "EDV": "Delta Connection"
                };
                
                const airlineName = airlineNames[validAirlineCode] || validAirlineCode;
                originDisplay = `${airlineName} Flight`;
                flightTimeDisplay = "Approaching";
                console.log(`Using default commercial flight info for ${airlineName}`);
              }
            }
            
            const newLandingFlightData = {
              title: "Upcoming Landing",
              number: flightNumber,
              airline: validAirlineCode,
              origin: originDisplay,
              runway: "Approaching",
              originCode: originCodeDisplay,
              registration: data.r || flightInfo?.registration || "Unknown",
              altitude: typeof data.alt_baro === "number" ? data.alt_baro : 0,
              speed: data.gs || 0,
              verticalRate: data.baro_rate || 0,
              flightTime: flightTimeDisplay,
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
