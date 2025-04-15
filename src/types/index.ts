// types/index.ts
export interface Flight {
  flight_number: string;
  time: string;
  type: string;
  origin_city: string;
  origin: string;
  aircraft_type: string;
  registration: string;
  runway: string;
  flight_time: string;
  status: string;
}

export interface Weather {
  city: string;
  temperature: number;
  feels_like: number;
  wind: number;
  timezone: number;
  icon: string;
}

export interface AirportData {
  flights: Flight[];
  weather: Weather;
}

export interface AirportDisplayProps {
  airportCode?: string;
  airportName?: string;
  location?: string;
  windDirection?: number;
  windSpeed?: number;
  timeZone?: "east" | "west";
}