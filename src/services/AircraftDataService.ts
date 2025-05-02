// src/services/AircraftDataService.ts
import { Aircraft, Flight } from "@/types";
import { fetchLandingAircraft } from "@/app/services/api";
import {
  LANDING_DATA_POLLING_INTERVAL,
  FLIGHT_DATA_POLLING_INTERVAL,
  LANDING_ALTITUDE_THRESHOLD,
  LANDING_SPEED_THRESHOLD,
  NEGATIVE_VERTICAL_RATE_THRESHOLD,
  LANDING_RESET_INTERVAL,
  LANDING_DEBUG_MODE,
  LANDING_DEBUG_ALTITUDE_THRESHOLD,
  LANDING_DEBUG_LOG_PATH,
} from "@/constants/polling";
import {
  writeLandingDebugLog,
  LandingDebugEntry,
  LandingStatus,
} from "@/utils/debugLogger";

// Enable/disable debug logging and mock mode
const DEBUG_LOGGING = process.env.NEXT_PUBLIC_DEBUG_LOGGING === "true";
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

export interface AircraftData {
  aircraft: Aircraft[];
}

export type EventListener = (event: string, data: any) => void;

/**
 * Service for fetching and processing aircraft data
 */
class AircraftDataService {
  private listeners: EventListener[] = [];
  private landingAircraft: Aircraft | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private flightDataInterval: NodeJS.Timeout | null = null;
  private landingResetTimeout: NodeJS.Timeout | null = null;
  private lastFlightDataRefresh: number = 0;
  private flightData: { flights: Flight[] } | null = null;

  /**
   * Log a message if debug logging is enabled
   */
  private log(message: string, data?: any): void {
    if (DEBUG_LOGGING) {
      if (data) {
        console.log(`[AircraftDataService] ${message}`, data);
      } else {
        console.log(`[AircraftDataService] ${message}`);
      }
    }
  }

  /**
   * Log an error
   */
  private logError(message: string, error?: any): void {
    if (error) {
      console.error(`[AircraftDataService] ERROR: ${message}`, error);
    } else {
      console.error(`[AircraftDataService] ERROR: ${message}`);
    }
  }

  /**
   * Start polling for aircraft data
   */
  public startPolling(): void {
    this.log("Starting polling for aircraft data");

    // Clear any existing interval
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial data load
    this.loadFlightData();
    this.fetchAircraftData();

    // Set up polling for aircraft data
    this.pollingInterval = setInterval(() => {
      this.fetchAircraftData();
    }, LANDING_DATA_POLLING_INTERVAL);

    // Set up separate polling for flight data (less frequent)
    this.flightDataInterval = setInterval(() => {
      this.loadFlightData();
    }, FLIGHT_DATA_POLLING_INTERVAL);
  }

  /**
   * Stop polling for aircraft data
   */
  public stopPolling(): void {
    this.log("Stopping polling for aircraft data");

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    if (this.flightDataInterval) {
      clearInterval(this.flightDataInterval);
      this.flightDataInterval = null;
    }

    if (this.landingResetTimeout) {
      clearTimeout(this.landingResetTimeout);
      this.landingResetTimeout = null;
    }
  }

  /**
   * Load flight data from the API
   */
  private async loadFlightData(): Promise<void> {
    // Check if we need to refresh the flight data
    const now = Date.now();
    if (
      now - this.lastFlightDataRefresh < FLIGHT_DATA_POLLING_INTERVAL &&
      this.flightData
    ) {
      this.log(
        "Using cached flight data - next refresh in " +
          Math.round(
            (FLIGHT_DATA_POLLING_INTERVAL -
              (now - this.lastFlightDataRefresh)) /
              1000
          ) +
          " seconds"
      );
      return;
    }

    this.log(
      "Flight data refresh needed - it's been " +
        Math.round((now - this.lastFlightDataRefresh) / 1000) +
        " seconds since last refresh"
    );

    this.lastFlightDataRefresh = now;

    // In mock mode, use local JSON file
    if (MOCK_MODE) {
      try {
        this.log("MOCK MODE: Loading flight data from local file");
        const response = await fetch("/flightData.json");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        this.flightData = await response.json();
        this.log(
          "Flight data loaded successfully from local file",
          this.flightData
        );

        // Log the flights for debugging
        if (this.flightData && this.flightData.flights) {
          this.log(`Loaded ${this.flightData.flights.length} flights`);
          this.flightData.flights.forEach((flight, index) => {
            this.log(
              `Flight ${index + 1}: ${flight.flight_number} - ${
                flight.origin_city || "Unknown origin"
              } - ${flight.flight_time || "Unknown duration"}`
            );
          });
        }
      } catch (error) {
        this.logError("Error loading flight data from local file:", error);
      }
    } else {
      // In normal mode, we don't need to fetch flight data separately
      // We'll extract it from the landing aircraft data when needed
      this.log("Not in mock mode, skipping flight data loading");

      // Create an empty flight data structure if we don't have one yet
      if (!this.flightData) {
        this.flightData = { flights: [] };
      }
    }
  }

  /**
   * Find flight information from the local flight data
   * @param {string} flightNumber - The flight number to look up
   * @returns {Flight|null} - The flight information or null if not found
   */
  private findFlightInfo(flightNumber: string): Flight | null {
    if (!this.flightData || !this.flightData.flights || !flightNumber) {
      return null;
    }

    // Clean up the flight number by removing spaces
    const cleanFlightNumber = flightNumber.trim();
    
    this.log(`Looking up flight info for: "${cleanFlightNumber}"`);
    
    // First try exact match
    let flightInfo = this.flightData.flights.find((flight) => {
      // Try to match by flight number (case insensitive)
      if (flight.flight_number && cleanFlightNumber) {
        // Normalize both flight numbers for comparison
        const normalizedFlightNumber = flight.flight_number
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");
        const normalizedSearchNumber = cleanFlightNumber
          .toLowerCase()
          .replace(/\s+/g, "");

        if (normalizedFlightNumber === normalizedSearchNumber) {
          this.log(`Found exact match for flight: ${flight.flight_number}`);
          return true;
        }
      }
      return false;
    });
    
    if (flightInfo) {
      return flightInfo;
    }
    
    // Try matching just the numeric part
    flightInfo = this.flightData.flights.find((flight) => {
      if (flight.flight_number && cleanFlightNumber) {
        // Try matching just the numeric part (for cases where airline code might differ)
        const flightNumberDigits = flight.flight_number.replace(
          /[^0-9]/g,
          ""
        );
        const searchNumberDigits = cleanFlightNumber.replace(
          /[^0-9]/g,
          ""
        );

        if (
          flightNumberDigits &&
          searchNumberDigits &&
          flightNumberDigits === searchNumberDigits &&
          flightNumberDigits.length > 0
        ) {
          this.log(
            `Found match by flight number digits: ${flightNumberDigits}`
          );
          return true;
        }
      }
      return false;
    });
    
    if (flightInfo) {
      return flightInfo;
    }
    
    // Try matching by registration
    if (cleanFlightNumber.match(/^N\d+[A-Z]*$/i)) {
      flightInfo = this.flightData.flights.find((flight) => {
        if (flight.registration && cleanFlightNumber) {
          const normalizedRegistration = flight.registration
            .toLowerCase()
            .replace(/\s+/g, "");
          const normalizedSearchNumber = cleanFlightNumber
            .toLowerCase()
            .replace(/\s+/g, "");

          if (normalizedRegistration === normalizedSearchNumber) {
            this.log(`Found match by registration: ${flight.registration}`);
            return true;
          }
        }
        return false;
      });
      
      if (flightInfo) {
        return flightInfo;
      }
    }

    // If no match found, try a more flexible search
    this.log(`No direct match found for: "${cleanFlightNumber}", trying flexible search...`);

    // Look for partial matches in flight numbers
    const partialMatches = this.flightData.flights.filter((flight) => {
      if (!flight.flight_number || !cleanFlightNumber) return false;

      const normalizedFlightNumber = flight.flight_number
        .trim()
        .toLowerCase();
      const normalizedSearchNumber = cleanFlightNumber.toLowerCase();

      // Check if one contains the other
      return (
        normalizedFlightNumber.includes(normalizedSearchNumber) ||
        normalizedSearchNumber.includes(normalizedFlightNumber)
      );
    });

    if (partialMatches.length > 0) {
      this.log(
        `Found ${partialMatches.length} partial matches:`,
        partialMatches
      );
      // Return the first partial match
      return partialMatches[0];
    }
    
    // Special handling for EDV (Endeavor Air) flights - try to match with Delta flights
    if (cleanFlightNumber.startsWith("EDV")) {
      this.log("Trying to match Endeavor Air flight with Delta flights");
      const deltaFlights = this.flightData.flights.filter(flight => 
        flight.airline === "DAL" || flight.flight_number.startsWith("DAL")
      );
      
      if (deltaFlights.length > 0) {
        this.log("Using a Delta flight as a fallback for Endeavor Air flight");
        return deltaFlights[0];
      }
    }

    this.log(`No flight info found for: "${cleanFlightNumber}" after all attempts`);
    return null;
  }

  /**
   * Fetch aircraft data from the API
   */
  private async fetchAircraftData(): Promise<void> {
    try {
      this.log("Fetching aircraft data using API service");

      // Use the API service instead of direct fetch
      const data = await fetchLandingAircraft();

      // If null is returned, it means we're not viewing RDU airport
      if (data === null) {
        this.log(
          "Not viewing RDU airport, skipping landing aircraft processing"
        );
        return;
      }

      this.log("Aircraft data loaded successfully from API", data);
      this.processAircraftData(data);
    } catch (error: any) {
      this.logError("Error fetching aircraft data:", error);
    }
  }

  /**
   * Process the aircraft data to find planes that are about to land
   * @param {AircraftData} data - The aircraft data from the API
   */
  private processAircraftData(data: AircraftData): void {
    if (!data || !data.aircraft || !Array.isArray(data.aircraft)) {
      this.log("No aircraft data to process");
      return;
    }

    this.log(`Processing ${data.aircraft.length} aircraft`);

    // Debug logging - collect all aircraft that meet debug criteria
    if (LANDING_DEBUG_MODE) {
      const debugEntries: LandingDebugEntry[] = [];
      const timestamp = new Date().toISOString();

      // Process all aircraft for debug logging
      data.aircraft.forEach((aircraft) => {
        // Skip aircraft on the ground or with invalid altitude
        if (
          aircraft.alt_baro === "ground" ||
          typeof aircraft.alt_baro !== "number"
        ) {
          return;
        }

        // Check if it meets debug altitude threshold
        if (aircraft.alt_baro <= LANDING_DEBUG_ALTITUDE_THRESHOLD) {
          // Check landing criteria
          const isLowAltitude = aircraft.alt_baro <= LANDING_ALTITUDE_THRESHOLD;
          const hasLandingSpeed =
            aircraft.gs !== undefined && aircraft.gs <= LANDING_SPEED_THRESHOLD;
          // If vertical rate is not available, we'll consider it as meeting this criteria
          const isDescending =
            aircraft.baro_rate === undefined ||
            aircraft.baro_rate < NEGATIVE_VERTICAL_RATE_THRESHOLD;

          // Determine status and reason
          let status: LandingStatus;
          let reason: string;

          const meetsAllCriteria =
            isLowAltitude && hasLandingSpeed && isDescending;
          const wouldTriggerAlert =
            meetsAllCriteria &&
            (!this.landingAircraft ||
              this.landingAircraft.hex !== aircraft.hex);

          if (wouldTriggerAlert) {
            status = LandingStatus.CRITERIA_MET;
            reason = "Met all landing criteria and will trigger alert (waiting for display confirmation)";
          } else if (meetsAllCriteria) {
            status = LandingStatus.CRITERIA_MET;
            reason =
              "Met all landing criteria but is same as previous aircraft";
          } else if (isLowAltitude || hasLandingSpeed || isDescending) {
            status = LandingStatus.PARTIAL_CRITERIA;
            reason = `Met some landing criteria: ${
              isLowAltitude ? "altitude " : ""
            }${hasLandingSpeed ? "speed " : ""}${
              isDescending ? "vertical_rate " : ""
            }`;
          } else {
            status = LandingStatus.ALTITUDE_ONLY;
            reason = "Only met debug altitude threshold";
          }

          // Add to debug entries
          debugEntries.push({
            hex: aircraft.hex,
            flight: aircraft.flight,
            altitude: aircraft.alt_baro,
            speed: aircraft.gs,
            vertical_rate: aircraft.baro_rate,
            status,
            reason,
            timestamp,
          });
        }
      });

      // Write debug log if we have entries
      if (debugEntries.length > 0) {
        this.log(`Writing ${debugEntries.length} aircraft to debug log`);
        writeLandingDebugLog(LANDING_DEBUG_LOG_PATH, debugEntries);
      }
    }

    // Find aircraft that are about to land
    const landingAircraft = data.aircraft.find((aircraft) => {
      // Skip aircraft on the ground
      if (
        aircraft.alt_baro === "ground" ||
        typeof aircraft.alt_baro !== "number"
      ) {
        return false;
      }

      // Check if it's below our altitude threshold
      const isLowAltitude = aircraft.alt_baro <= LANDING_ALTITUDE_THRESHOLD;

      // Check if it has a reasonable ground speed for landing
      const hasLandingSpeed =
        aircraft.gs !== undefined && aircraft.gs <= LANDING_SPEED_THRESHOLD;

      // Check if it's descending (negative vertical rate) - only if vertical rate is available
      // If vertical rate is not available, we'll consider it as meeting this criteria
      const isDescending =
        aircraft.baro_rate === undefined ||
        aircraft.baro_rate < NEGATIVE_VERTICAL_RATE_THRESHOLD;

      const isLanding = isLowAltitude && hasLandingSpeed && isDescending;

      if (isLowAltitude) {
        this.log(
          `Aircraft ${aircraft.flight || aircraft.hex} at low altitude: ${
            aircraft.alt_baro
          }ft`
        );
      }

      if (isLanding) {
        this.log(
          `Landing aircraft detected: ${aircraft.flight || aircraft.hex} at ${
            aircraft.alt_baro
          }ft, ${aircraft.gs}kts, ${aircraft.baro_rate}ft/min`
        );
      }

      return isLanding;
    });

    // If we found a landing aircraft and it's different from the previous one
    if (
      landingAircraft &&
      (!this.landingAircraft ||
        this.landingAircraft.hex !== landingAircraft.hex)
    ) {
      this.log("Found landing aircraft:", landingAircraft);

      // Enrich with flight information from our local data
      if (landingAircraft.flight) {
        this.log(`Attempting to match flight: ${landingAircraft.flight}`);
        const flightInfo = this.findFlightInfo(landingAircraft.flight.trim());
        if (flightInfo) {
          this.log("Found flight info by flight number:", flightInfo);
          landingAircraft.flightInfo = flightInfo;
        } else {
          this.log(
            `No flight info found for flight: ${landingAircraft.flight.trim()}`
          );
        }
      } else if (landingAircraft.r) {
        // Try to match by registration
        this.log(`Attempting to match by registration: ${landingAircraft.r}`);
        const flightInfo = this.findFlightInfo(landingAircraft.r);
        if (flightInfo) {
          this.log("Found flight info by registration:", flightInfo);
          landingAircraft.flightInfo = flightInfo;
        } else {
          this.log(
            `No flight info found for registration: ${landingAircraft.r}`
          );
        }
      } else {
        this.log("Aircraft has no flight number or registration to match");
      }

      // Log the final aircraft data with flight info
      this.log("Final landing aircraft data:", landingAircraft);

      // Log flight info specifically for debugging
      if (landingAircraft.flightInfo) {
        this.log("Flight info found:", {
          flight_number: landingAircraft.flightInfo.flight_number,
          origin_city: landingAircraft.flightInfo.origin_city,
          origin: landingAircraft.flightInfo.origin,
          flight_time: landingAircraft.flightInfo.flight_time,
        });
      } else {
        this.log("No flight info found for landing aircraft");
      }

      this.landingAircraft = landingAircraft;
      this.notifyListeners("landing", landingAircraft);

      // Set a timeout to reset the landing aircraft after a period
      // This allows the same aircraft to trigger the alert again
      if (this.landingResetTimeout) {
        clearTimeout(this.landingResetTimeout);
      }

      this.landingResetTimeout = setTimeout(() => {
        this.log(
          `Resetting landing aircraft detection for ${
            landingAircraft.flight || landingAircraft.hex
          }`
        );
        this.landingAircraft = null;
      }, LANDING_RESET_INTERVAL);
    }
  }

  /**
   * Add a listener for aircraft events
   * @param {EventListener} callback - The callback function
   * @returns {Function} - Function to remove the listener
   */
  public addListener(callback: EventListener): () => void {
    if (typeof callback === "function" && !this.listeners.includes(callback)) {
      this.listeners.push(callback);
      this.log("Added event listener, total listeners:", this.listeners.length);
    }
    return () => this.removeListener(callback);
  }

  /**
   * Remove a listener
   * @param {EventListener} callback - The callback function to remove
   */
  public removeListener(callback: EventListener): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
    this.log(
      "Removed event listener, remaining listeners:",
      this.listeners.length
    );
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - The event name
   * @param {any} data - The event data
   */
  private notifyListeners(event: string, data: any): void {
    this.log(`Notifying ${this.listeners.length} listeners of event: ${event}`);
    console.log(`[AircraftDataService] Notifying ${this.listeners.length} listeners of event: ${event}`);

    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (error) {
        this.logError("Error in aircraft data listener:", error);
      }
    });
  }
}

// Create and export a singleton instance
const aircraftDataService = new AircraftDataService();
export default aircraftDataService;
