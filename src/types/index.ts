// types/index.ts
export interface Weather {
  airport_name?: string;
  city?: string;
  description?: string;
  icon?: string;
  latitude?: number;
  longitude?: number;
  main?: string;
  raw_metar?: string;
  temperature?: number;
  temperature_celsius?: number;
  visibility?: number;
  wind?: number;
  wind_direction: number;
  wind_gusts?: number;
}

export interface Flight {
  flight_number?: string;
  time?: string;
  type?: 'arrival' | 'departure';
  origin_city?: string;
  origin?: string;
  destination_city?: string;
  destination?: string;
  aircraft_type?: string;
  registration?: string;
  gate?: string | null;
  status?: string;
  airline?: string | null;
  flight_time?: string;
  diverted?: boolean;
}

export interface AirportData {
  flights: Flight[];
  weather: Weather;
}