// utils/mockData.ts - Your provided mock data
export const mockFlightData = {
  "flights": [
    {
      "flight_number": "EJA915",
      "time": "02:13 PM",
      "type": "arrival",
      "origin_city": "Miami",
      "origin": "MIA",
      "aircraft_type": "C68A",
      "registration": "N915QS",
      "runway": "05R",
      "flight_time": "2h 19m",
      "status": "Arrived"
    },
    {
      "flight_number": "AAL2693",
      "time": "02:26 PM",
      "type": "arrival",
      "origin_city": "Dallas-Fort Worth",
      "origin": "DFW",
      "aircraft_type": "B738",
      "registration": "N891NN",
      "runway": "05R",
      "flight_time": "3h 39m",
      "status": "Arrived / Gate Arrival"
    }
    // ... add more flights as needed
  ],
  "weather": {
    "city": "Raleigh",
    "temperature": 56,
    "feels_like": 56.07,
    "wind": 8,
    "timezone": -14400,
    "icon": "http://openweathermap.org/img/w/50d.png"
  }
};

// Additional airport information (could be expanded later)
export const mockAirportInfo = {
  "RDU": {
    airportCode: "RDU / KRDU",
    airportName: "Raleigh-Durham International Airport",
    location: "North Carolina, USA",
    windDirection: 270,
  }
};