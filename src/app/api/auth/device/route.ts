import { NextRequest, NextResponse } from "next/server";
import { 
  generateDeviceCode, 
  getDeviceStatus, 
  authenticateDevice,
  getDeviceTokens,
  storeVerificationUris
} from "../../../../auth/auth-utils";

// Generate a new device code
export async function GET() {
  try {
    const { deviceCode, userCode, verificationUri, verificationUriComplete } = await generateDeviceCode();
    
    // Store the verification URIs for this device code
    storeVerificationUris(deviceCode, verificationUri, verificationUriComplete);
    
    return NextResponse.json({ 
      deviceCode,
      userCode,
      verificationUri,
      verificationUriComplete
    });
  } catch (error) {
    console.error("Error generating device code:", error);
    return NextResponse.json({ error: "Failed to generate device code" }, { status: 500 });
  }
}

// Check device authentication status
export async function POST(request: NextRequest) {
  const { deviceCode } = await request.json();
  
  const result = getDeviceStatus(deviceCode);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  
  return NextResponse.json(result);
}

// Authenticate a device (called from the mobile flow)
export async function PUT(request: NextRequest) {
  const { deviceCode, userId, email, refreshToken, accessToken } = await request.json();
  
  const result = authenticateDevice(deviceCode, userId, email, refreshToken, accessToken);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  
  return NextResponse.json({ success: true });
}

// Get device tokens
export async function PATCH(request: NextRequest) {
  const { deviceCode } = await request.json();
  
  const result = getDeviceTokens(deviceCode);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  
  return NextResponse.json(result);
}
