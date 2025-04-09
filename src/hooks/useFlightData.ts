// // src/hooks/useFlightData.ts
// import { useState, useEffect } from 'react';
// import { Flight, Approach } from '../types/flight';

// export const useFlightData = () => {
//   const [flight, setFlight] = useState<Flight | null>(null);
//   const [approach, setApproach] = useState<Approach | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Replace with your actual API calls
//         const flightResponse = await fetch('/api/flight');
//         const approachResponse = await fetch('/api/approach');
        
//         const flightData = await flightResponse.json();
//         const approachData = await approachResponse.json();

//         setFlight(flightData);
//         setApproach(approachData);
//       } catch (err) {
//         setError(err as Error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { flight, approach, loading, error };
// };
