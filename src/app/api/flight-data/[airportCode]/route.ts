// src/app/api/flight-data/[airportCode]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Cache the flight data for 5 minutes
const CACHE_MAX_AGE = 5 * 60; // 5 minutes in seconds

// In-memory cache - key is airportCode, value is { data, timestamp }
const cache: Record<string, { data: any; timestamp: number }> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { airportCode: string } }
) {
  // Get the airport code from the URL params
  const airportCode = params.airportCode.toLowerCase();

  console.log(`[API] Processing request for airport: ${airportCode}`);

  // Check if we have cached data that's still valid
  const now = Date.now();
  if (
    cache[airportCode] &&
    now - cache[airportCode].timestamp < CACHE_MAX_AGE * 1000
  ) {
    console.log(
      `[API] Using cached flight data for ${airportCode} - ${Math.round(
        (now - cache[airportCode].timestamp) / 1000
      )}s old`
    );
    return NextResponse.json(cache[airportCode].data);
  }

  console.log(
    `[API] Flight data cache expired or not available for ${airportCode}, fetching fresh data`
  );

  try {
    // Get the access token from the request headers
    const authHeader = request.headers.get("Authorization");

    // Prepare headers for the external API request
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // If we have an auth header, forward it to the external API
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Make the request to the external API
    const response = await fetch(
      `https://flyby.colonmelvin.com/api/flight-data/${airportCode}`,
      {
        headers,
        cache: "no-store", // Don't cache the response at the fetch level
      }
    );

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    // Get the response data
    const data = await response.json();

    // Cache the data
    cache[airportCode] = { data, timestamp: now };
    console.log(`[API] Flight data cached successfully for ${airportCode}`);

    // Return the data
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error(`Error fetching flight data for ${airportCode}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
