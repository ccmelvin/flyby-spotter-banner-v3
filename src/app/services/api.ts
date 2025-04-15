// services/api.ts
import axios from 'axios';
import { AirportData } from '../../types/index';
import { mockFlightData, mockAirportInfo } from '../../utils/data';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://flyby.colonmelvin.com/api/flight-data",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all airport data (flights and weather)
export const fetchAirportData = async (airportCode: string): Promise<AirportData> => {
  try {
    // When API is ready, uncomment this
    // const response = await api.get(`/airport/${airportCode}`);
    // return response.data;
    
    // For now, return mock data with a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFlightData as AirportData;
  } catch (error) {
    console.error('Error fetching airport data:', error);
    throw error;
  }
};

// Fetch airport information
export const fetchAirportInfo = async (airportCode: string) => {
  try {
    // When API is ready, uncomment this
    // const response = await api.get(`/airports/${airportCode}`);
    // return response.data;
    
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAirportInfo[airportCode] || {
      airportCode: airportCode,
      airportName: "Airport Information Unavailable",
      location: "",
      windDirection: 0,
      
    };
  } catch (error) {
    console.error('Error fetching airport info:', error);
    throw error;
  }
};