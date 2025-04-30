// src/app/api/landing/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("[API] Fetching fresh landing data");
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
    const response = await fetch("https://flyby.colonmelvin.com/rdu/?all", {
      headers,
      cache: "no-store", // Don't cache the response
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    // Get the response data
    const data = await response.json();
    console.log("[API] Landing data fetched successfully");

    // Return the data without caching
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing data" },
      { status: 500 }
    );
  }
}
