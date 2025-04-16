// hooks/useAirportData.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAirportData } from "../app/services/api";
import { Flight, AirportData } from "../types";

export function useAirportData(airportCode: string) {
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(false);

  // Fetch airport data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["airport-data", airportCode],
    queryFn: () => fetchAirportData(airportCode),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!data || !data.airportData || !data.airportData.flights || data.airportData.flights.length === 0) return;

    setCurrentFlight(data.airportData.flights[0]);
    
    let flightIndex = 0;
    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % data.airportData.flights.length;
      setCurrentFlight(data.airportData.flights[flightIndex]);
      setIsNewEntry(true);
      setTimeout(() => setIsNewEntry(false), 500);
    }, 8000);

    return () => clearInterval(flightInterval);
  }, [data]);

  return {
    currentFlight,
    isNewEntry,
    weatherData: data?.weatherData || null,
    flights: data?.airportData?.flights || [],
    isLoading,
    error,
  };
}