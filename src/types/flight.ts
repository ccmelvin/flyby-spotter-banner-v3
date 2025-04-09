export interface Flight {
  title: string;
    number: string;
    airline: string;
    origin: string;
    originCode: string;
    registration: string;
    runway: string;
  }
  

  export interface FlightApproachDisplayProps {
    flight: Flight;
  }
  

  export interface FlightData {
    id: string
    flightNumber: string
    airline: string
    logo: string
    origin: string
    aircraft: string
    runway: string
    estimatedTouchdown: Date
    altitude: number
    distance: number
    speed: number
    verticalSpeed: number
    heading: number
  }