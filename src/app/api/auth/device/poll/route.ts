import { NextRequest, NextResponse } from "next/server";
import { pollDeviceCodeTokens } from "../../../../../auth/auth-utils";

// Poll for device code tokens
export async function POST(request: NextRequest) {
  try {
    const { deviceCode } = await request.json();
    
    if (!deviceCode) {
      return NextResponse.json({ error: "Missing device code" }, { status: 400 });
    }
    
    // Poll Auth0 for tokens using the device code
    const tokenResponse = await pollDeviceCodeTokens(deviceCode);
    
    // If there's an error but it's just "authorization_pending", return a 202 status
    // This is expected while waiting for the user to complete authentication
    if (tokenResponse.error === "authorization_pending") {
      return NextResponse.json({ 
        error: "authorization_pending",
        error_description: "The user has not yet completed the authentication"
      }, { status: 202 });
    }
    
    // If there's any other error, return it
    if (tokenResponse.error) {
      return NextResponse.json({ 
        error: tokenResponse.error,
        error_description: tokenResponse.error_description
      }, { status: 400 });
    }
    
    // If we got tokens, return them
    return NextResponse.json({
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      id_token: tokenResponse.id_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in
    });
  } catch (error) {
    console.error("Error polling for device code tokens:", error);
    return NextResponse.json({ error: "Failed to poll for tokens" }, { status: 500 });
  }
}
