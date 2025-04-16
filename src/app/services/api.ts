// src/app/services/api.ts
import axios from 'axios';
import { AirportData, Weather, Flight } from '../../types';
import { AIRPORT_DATA } from '../../utils/data';

const isBrowser = typeof window !== 'undefined';

export class ApiService {
  private baseURL: string;
  private useMockData: boolean;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://flyby.colonmelvin.com/api/flight-data";
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'false';
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!isBrowser) {
      throw new Error('API calls can only be made in the browser');
    }

    const accessToken = localStorage.getItem('auth0_access_token');
    console.log('Access Token:', accessToken);
    
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

  async fetchAirportData(airportCode: string): Promise<{
    currentFlight: Flight[];
    weatherData: Weather;
    airportData: AirportData;
  }> {
    if (this.useMockData) {
      console.log('Using mock data for airport data');
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        currentFlight: AIRPORT_DATA.flights,
        weatherData: AIRPORT_DATA.weather,
        airportData: AIRPORT_DATA,
      };
    }

    console.log('Fetching real data from API', this.baseURL);
    console.log('Airport Code:', airportCode);
    console.log('Access Token:', localStorage.getItem('auth0_access_token'));
    console.log('airport data:', AIRPORT_DATA);
    return this.makeRequest(`/${airportCode}`);
  }

  async fetchAirportInfo(airportCode: string) {
    if (this.useMockData) {
      console.log('Using mock data for airport info');
      await new Promise(resolve => setTimeout(resolve, 200));
      return AIRPORT_DATA[airportCode] || {
        airportCode,
        airportName: "",
        location: "",
        windDirection: 0,
      };
    }

    return this.makeRequest(`/${airportCode}`);
  }
}

// Export a singleton instance
export const api = new ApiService();

// Export the methods with the same names as used in components
export const fetchAirportData = (airportCode: string) => api.fetchAirportData(airportCode);
export const fetchAirportInfo = (airportCode: string) => api.fetchAirportInfo(airportCode);
