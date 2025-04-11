import { v4 as uuidv4 } from "uuid";
import { domain, clientId, audience, scope } from "./auth0-config";

// In-memory store for device codes
// In a production environment, this should be replaced with a database
const deviceSessions = new Map<string, {
  status: "pending" | "authenticated";
  userId?: string;
  email?: string;
  refreshToken?: string;
  accessToken?: string;
  createdAt: number;
}>();

// Clean up expired sessions (15 minutes)
const EXPIRY_TIME = 15 * 60 * 1000;

export function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [code, session] of deviceSessions.entries()) {
    if (now - session.createdAt > EXPIRY_TIME) {
      deviceSessions.delete(code);
    }
  }
}

// Generate a new device code
export async function generateDeviceCode(): Promise<{ deviceCode: string, userCode: string, verificationUri: string, verificationUriComplete: string }> {
  cleanupExpiredSessions();
  
  // Request device and user codes from Auth0
  const response = await fetch(`https://${domain}/oauth/device/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      scope: scope,
      audience: audience,
    }),
  });
  
  const data = await response.json();
  
  // Log the response from Auth0
  console.log("Auth0 Device Code Response:", data);
  
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }
  
  const { device_code, user_code, verification_uri, verification_uri_complete } = data;
  
  // Store the device code in our session map
  deviceSessions.set(device_code, {
    status: "pending",
    createdAt: Date.now(),
  });
  
  return {
    deviceCode: device_code,
    userCode: user_code,
    verificationUri: verification_uri,
    verificationUriComplete: verification_uri_complete,
  };
}

// Check device authentication status
export function getDeviceStatus(deviceCode: string) {
  if (!deviceCode || !deviceSessions.has(deviceCode)) {
    return { error: "Invalid device code" };
  }
  
  const session = deviceSessions.get(deviceCode);
  
  return {
    status: session?.status || "pending",
    email: session?.email,
  };
}

// Authenticate a device
export function authenticateDevice(deviceCode: string, userId: string, email: string, refreshToken: string, accessToken: string) {
  if (!deviceCode || !deviceSessions.has(deviceCode)) {
    return { error: "Invalid device code" };
  }
  
  if (!userId || !email) {
    return { error: "Missing user information" };
  }
  
  deviceSessions.set(deviceCode, {
    status: "authenticated",
    userId,
    email,
    refreshToken,
    accessToken,
    createdAt: Date.now(),
  });
  
  return { success: true };
}

// Get device tokens
export function getDeviceTokens(deviceCode: string) {
  if (!deviceCode || !deviceSessions.has(deviceCode)) {
    return { error: "Invalid device code" };
  }
  
  const session = deviceSessions.get(deviceCode);
  
  if (session?.status !== "authenticated") {
    return { error: "Device not authenticated" };
  }
  
  return {
    refreshToken: session.refreshToken,
    accessToken: session.accessToken,
  };
}

// Store verification URIs for device codes
const verificationUris = new Map<string, { verificationUri: string, verificationUriComplete: string }>();

// Generate Auth0 authorization URL
export function getAuthorizationUrl(deviceCode: string): string {
  // Return the verification URI complete for this device code
  const uris = verificationUris.get(deviceCode);
  if (!uris) {
    return `https://${domain}/activate`; // Fallback to generic activation URL
  }
  
  return uris.verificationUriComplete;
}

// Store verification URIs for a device code
export function storeVerificationUris(deviceCode: string, verificationUri: string, verificationUriComplete: string): void {
  verificationUris.set(deviceCode, { verificationUri, verificationUriComplete });
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    }),
  });

  return await response.json();
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  return await response.json();
}

// Poll for device code tokens
export async function pollDeviceCodeTokens(deviceCode: string) {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      device_code: deviceCode,
      client_id: clientId,
    }),
  });

  return await response.json();
}
