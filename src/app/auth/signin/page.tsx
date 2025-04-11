"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [verificationUri, setVerificationUri] = useState<string | null>(null);
  const [verificationUriComplete, setVerificationUriComplete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"pending" | "authenticated">("pending");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Generate a device code when the page loads
  useEffect(() => {
    async function generateDeviceCode() {
      try {
        const response = await fetch("/api/auth/device");
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }
        
        setDeviceCode(data.deviceCode);
        setUserCode(data.userCode);
        setVerificationUri(data.verificationUri);
        setVerificationUriComplete(data.verificationUriComplete);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to generate device code");
        setIsLoading(false);
      }
    }

    generateDeviceCode();
  }, []);

  // Poll for authentication status using device code flow
  useEffect(() => {
    if (!deviceCode || authStatus === "authenticated") return;

    const interval = setInterval(async () => {
      try {
        // Poll Auth0 directly for tokens using the device code
        const response = await fetch("/api/auth/device/poll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceCode }),
        });

        const data = await response.json();
        
        console.log("Poll response:", data);
        
        // If we got tokens, authentication was successful
        if (data.access_token && data.refresh_token) {
          // Store tokens in localStorage
          localStorage.setItem("auth0_access_token", data.access_token);
          localStorage.setItem("auth0_refresh_token", data.refresh_token);
          
          // Extract user info from ID token
          if (data.id_token) {
            const payload = JSON.parse(atob(data.id_token.split('.')[1]));
            setUserEmail(payload.email);
          }
          
          setAuthStatus("authenticated");
          
          // Redirect to the dashboard after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (err) {
        console.error("Error polling for tokens:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [deviceCode, authStatus, router]);

  // Use the verification URI complete from Auth0
  const authUrl = verificationUriComplete || "";

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Loading...</h1>
          <p className="text-center text-gray-500">
            Preparing your authentication QR code...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-red-600">Error</h1>
          <p className="text-center text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (authStatus === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-green-600">
            Authentication Successful!
          </h1>
          <p className="text-center text-gray-500">
            You are signed in as {userEmail}
          </p>
          <p className="text-center text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <p className="text-center text-gray-500">
          Scan the QR code with your mobile device to sign in
        </p>
        
        {userCode && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">Or enter this code:</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{userCode}</p>
          </div>
        )}
        
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          {deviceCode && (
            <QRCodeSVG
              value={verificationUriComplete || ""}
              size={256}
              level="H"
              includeMargin={true}
            />
          )}
        </div>
        
        <p className="text-sm text-center text-gray-500">
          Or visit this URL on your mobile device:
        </p>
        <div className="overflow-x-auto">
          <p className="text-sm text-center font-mono bg-blue-100 p-2 rounded break-all text-blue-800">
            {verificationUriComplete || "No URL available"}
          </p>
        </div>
        <div className="mt-2 text-xs text-center text-gray-400">
          Debug: {verificationUriComplete ? `URI exists: ${verificationUriComplete}` : "URI missing"}
        </div>
      </div>
    </div>
  );
}
