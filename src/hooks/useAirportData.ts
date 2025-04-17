// hooks/useAirportData.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAirportData } from "../app/services/api";
import { Flight, Weather } from "../types";

export function useAirportData(airportCode: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNewEntry, setIsNewEntry] = useState(false);

  const { 
    data,
    isLoading,
    error 
  } = useQuery({
    queryKey: ["airport-data", airportCode],
    queryFn: () => fetchAirportData(airportCode),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!airportCode // Only run the query if airportCode is provided
  });

  // Cycle through flights
  useEffect(() => {
    if (!data?.flights || data.flights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.flights.length;
        setIsNewEntry(true);
        setTimeout(() => setIsNewEntry(false), 500);
        return nextIndex;
      });
    }, 8000); // Change flight every 8 seconds

    return () => clearInterval(interval);
  }, [data?.flights]);

  // Prepare return data
  const currentFlight: Flight | null = data?.flights?.[currentIndex] || null;
  const weatherData: Weather | null = data?.weather || null;
  const totalFlights = data?.flights?.length || 0;

  return {
    currentFlight,
    weatherData,
    isNewEntry,
    currentFlightIndex: totalFlights > 0 ? currentIndex + 1 : 0,
    totalFlights,
    isLoading,
    error,
    airportData: data
  };
}