export const AIRLINE_LOGOS = {
  DHL: "/images/airlines/dhl.svg",
  UAL: "/images/airlines/united-airlines.svg",
  AAL: "/images/airlines/american-airlines.svg",
  DAL: "/images/airlines/delta-airlines.svg",
  SWA: "/images/airlines/southwest.svg",
  EDV: "/images/airlines/endeavor.svg", // Add Endeavor Air
  PRIVATE: "/images/airlines/cessna.svg", // Use cessna logo for private aircraft
  
  // Default logo for unknown airlines
  UNKNOWN: "/flyby-spotter-logo.png",
} as const;

// Helper function to check if an airline code exists in our logos
export const hasAirlineLogo = (code: string): boolean => {
  return Object.keys(AIRLINE_LOGOS).includes(code);
};

// Get a valid airline code that has a logo
export const getValidAirlineCode = (
  code: string
): keyof typeof AIRLINE_LOGOS => {
  if (!code || !hasAirlineLogo(code)) {
    return "UNKNOWN";
  }
  return code as keyof typeof AIRLINE_LOGOS;
};
