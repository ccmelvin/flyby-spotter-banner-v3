// src/app/services/api.ts
import axios from "axios";
import { AirportData, AirportInfoResponse, Aircraft } from "../../types";
import { AIRPORT_DATA } from "../../utils/data";

const isBrowser = typeof window !== "undefined";

// Constants
const RDU_AIRPORT_CODE = "rdu";

export class ApiService {
  private baseURL: string;
  private useMockData: boolean;
  private currentAirportCode: string | null = null;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://flyby.colonmelvin.com/api/flight-data";
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!isBrowser) {
      throw new Error("API calls can only be made in the browser");
    }

    const accessToken = localStorage.getItem("auth0_access_token");

    return axios({
      method: "GET",
      url: `${this.baseURL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      timeout: 10000,
    }).then((response) => response.data);
  }

  /**
   * Set the current airport code being viewed
   * This is used to determine if landing data should be fetched
   */
  setCurrentAirportCode(airportCode: string): void {
    this.currentAirportCode = airportCode.toLowerCase();
    console.log(
      `[ApiService] Current airport code set to: ${this.currentAirportCode}`
    );
  }

  /**
   * Get the current airport code
   */
  getCurrentAirportCode(): string | null {
    return this.currentAirportCode;
  }

  /**
   * Check if the current airport is RDU
   * This is used to determine if landing data should be fetched
   */
  isRduAirport(): boolean {
    return this.currentAirportCode === RDU_AIRPORT_CODE;
  }

  async fetchAirportData(airportCode: string): Promise<AirportData> {
    // Update the current airport code
    this.setCurrentAirportCode(airportCode);

    if (this.useMockData) {
      console.log("Using mock data for airport data");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return AIRPORT_DATA as AirportData;
    }

    console.log(
      "Fetching real data from API",
      `${this.baseURL}/${airportCode}`
    );
    return this.makeRequest<AirportData>(`/${airportCode}`);
  }

  async fetchAirportInfo(airportCode: string): Promise<AirportInfoResponse> {
    if (this.useMockData) {
      console.log("Using mock data for airport info");
      await new Promise((resolve) => setTimeout(resolve, 200));
      // Extract airport info from mock data or return default
      return {
        airportCode,
        airportName: AIRPORT_DATA.weather?.airport_name || "",
        location: AIRPORT_DATA.weather?.city || "",
        windDirection: AIRPORT_DATA.weather?.wind_direction || 0,
      };
    }

    return this.makeRequest<AirportInfoResponse>(`/info/${airportCode}`);
  }

  /**
   * Fetch landing aircraft data - only works for RDU airport
   * @returns Landing aircraft data or null if not RDU
   */
  async fetchLandingAircraft(): Promise<{ aircraft: Aircraft[] } | null> {
    // Only fetch landing data if we're viewing RDU airport
    if (!this.isRduAirport()) {
      console.log(
        "[ApiService] Not fetching landing data - current airport is not RDU"
      );
      return null;
    }

    if (this.useMockData) {
      console.log("[ApiService] Using mock data for landing aircraft");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { aircraft: [] }; // Return mock data structure
    }

    console.log("[ApiService] Fetching landing data for RDU");

    // Use relative URL to call our Next.js API route
    return axios({
      method: "GET",
      url: "/api/landing",
      headers: {
        "Content-Type": "application/json",
        ...(isBrowser &&
          localStorage.getItem("auth0_access_token") && {
            Authorization: `Bearer ${localStorage.getItem(
              "auth0_access_token"
            )}`,
          }),
      },
      timeout: 5000,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error("[ApiService] Error fetching landing data:", error);
        return { aircraft: [] };
      });
  }
}

// Export a singleton instance
export const api = new ApiService();

// Export the methods with the same names as used in components
export const fetchAirportData = (airportCode: string) =>
  api.fetchAirportData(airportCode);
export const fetchAirportInfo = (airportCode: string) =>
  api.fetchAirportInfo(airportCode);
export const fetchLandingAircraft = () => api.fetchLandingAircraft();
