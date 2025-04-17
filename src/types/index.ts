// types.ts

export interface Flight {
  flight_number: string;
  time: string;
  type: 'arrival' | 'departure';
  airline?: string;
  aircraft_type?: string;
  registration?: string;
  gate?: string;
  status?: string;
  diverted?: boolean;
  flight_time?: string;
  
  // For departures
  destination?: string;
  destination_city?: string;
  
  // For arrivals
  origin?: string | null;
  origin_city?: string;
}

export interface Weather {
  airport_name: string;
  city: string;
  description: string;
  icon: string;
  latitude: number;
  longitude: number;
  main: string;
  raw_metar: string;
  temperature: number;
  temperature_celsius: number;
  visibility: number;
  wind: number;
  wind_direction: number;
  wind_gusts: number;
}

export interface AirportData {
  flights: Flight[];
  weather: Weather;
  // Additional airport properties
  airportCode?: string;
  airportName?: string;
  location?: string;
}

// API response types
export interface AirportDataResponse {
  flights: Flight[];
  weather: Weather;
}

export interface AirportInfoResponse {
  airportCode: string;
  airportName: string;
  location: string;
  windDirection: number;
}