export const AIRLINE_LOGOS = {
  DHL: "/images/airlines/dhl.svg",
  UAL: "/images/airlines/united.svg",
  AAL: "/images/airlines/american-airlines.svg",
  DAL: "/images/airlines/delta.png",
  SWA: "/images/airlines/southwest.svg",

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
