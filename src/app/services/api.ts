// src/app/services/api.ts
import axios from 'axios';
import { AirportData, AirportInfoResponse } from '../../types';
import { AIRPORT_DATA } from '../../utils/data';

const isBrowser = typeof window !== 'undefined';

export class ApiService {
  private baseURL: string;
  private useMockData: boolean;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://flyby.colonmelvin.com/api/flight-data";
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true';
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!isBrowser) {
      throw new Error('API calls can only be made in the browser');
    }

    const accessToken = localStorage.getItem('auth0_access_token');
    
    return axios({
      method: 'GET',
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      timeout: 10000
    }).then(response => response.data);
  }

  async fetchAirportData(airportCode: string): Promise<AirportData> {
    if (this.useMockData) {
      console.log('Using mock data for airport data');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return AIRPORT_DATA as AirportData;
    }

    console.log('Fetching real data from API', `${this.baseURL}/${airportCode}`);
    return this.makeRequest<AirportData>(`/${airportCode}`);
  }

  async fetchAirportInfo(airportCode: string): Promise<AirportInfoResponse> {
    if (this.useMockData) {
      console.log('Using mock data for airport info');
      await new Promise(resolve => setTimeout(resolve, 200));
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
}

// Export a singleton instance
export const api = new ApiService();

// Export the methods with the same names as used in components
export const fetchAirportData = (airportCode: string) => api.fetchAirportData(airportCode);
export const fetchAirportInfo = (airportCode: string) => api.fetchAirportInfo(airportCode);