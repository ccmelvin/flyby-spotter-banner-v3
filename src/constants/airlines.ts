// src/constant/airlines.ts
export const AIRLINE_LOGOS = {
    "DHL": "/images/airlines/dhl.svg",
    "UAL": "/images/airlines/united.svg",
    "AAL": "/images/airlines/american-airlines.svg",
    "DAL": "/images/airlines/delta.png",
    "SWA": "/images/airlines/southwest.svg",
    "ASA": "/images/airlines/alaska_airlines.svg",
    "AVE": "/images/airlines/avelo-airlines.svg",
    "BAH": "/images/airlines/bahamas-air.svg",
    "CES": "/images/airlines/cessna.svg",
    "CPA": "/images/airlines/copa-airlines.svg",
    "BRZ": "/images/airlines/breeze-airways.svg",
    "ENY": "/images/airlines/endeavor.svg",
    "ENV": "/images/airlines/envoy-air.svg",
    "ICE": "/images/airlines/iceland-air.svg",
    "JBU": "/images/airlines/jet-blue.svg",
    "DLH": "/images/airlines/lufthansa.svg",
    "GEC": "/images/airlines/lufthansa-cargo.svg"
} as const;

// Create a type for valid airline codes
export type AirlineCode = keyof typeof AIRLINE_LOGOS;
