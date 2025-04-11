import { NextRequest, NextResponse } from "next/server";
import { getDeviceTokens } from "../../../../auth/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { deviceCode } = await request.json();
    
    if (!deviceCode) {
      return NextResponse.json({ error: "Device code is required" }, { status: 400 });
    }
    
    const tokens = getDeviceTokens(deviceCode);
    
    if (tokens.error) {
      return NextResponse.json({ error: tokens.error }, { status: 400 });
    }
    
    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return NextResponse.json({ error: "Failed to retrieve tokens" }, { status: 500 });
  }
}
