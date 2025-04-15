// hooks/useAirportData.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAirportData } from "../app/services/api";
import { Flight } from "../types";

export function useAirportData(airportCode: string) {
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(false);

  // Fetch airport data using React Query
  const { data: airportData, isLoading, error } = useQuery({
    queryKey: ["airport-data", airportCode],
    queryFn: () => fetchAirportData(airportCode),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!airportData?.flights || airportData.flights.length === 0) return;

    setCurrentFlight(airportData.flights[0]);
    
    let flightIndex = 0;
    const flightInterval = setInterval(() => {
      flightIndex = (flightIndex + 1) % airportData.flights.length;
      setCurrentFlight(airportData.flights[flightIndex]);
      setIsNewEntry(true);
      setTimeout(() => setIsNewEntry(false), 500);
    }, 8000);

    return () => clearInterval(flightInterval);
  }, [airportData]);

  return {
    currentFlight,
    isNewEntry,
    weatherData: airportData?.weather || null,
    isLoading,
    error,
  };
}
