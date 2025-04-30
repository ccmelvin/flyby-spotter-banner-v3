"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import FlightBannerTop from "@/components/FightBannerTop";
import FlightBannerBottom from "@/components/FlightBannerBottom";
import FlightApproachDisplay from "@/components/FlightApproachDisplay";
import LandingAlertManager from "@/components/LandingAlertManager";
import LandingDebugPanel from "@/components/LandingDebugPanel";
import Image from "next/image";
import { LANDING_DEBUG_MODE } from "@/constants/polling";

export default function Home() {
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  // const [verificationUri, setVerificationUri] = useState<string | null>(null);
  const [verificationUriComplete, setVerificationUriComplete] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<
    "pending" | "authenticated" | "checking"
  >("checking");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Check if already authenticated or handle callback
  useEffect(() => {
    // This effect will only run in the browser, not during server-side rendering
    if (typeof window === "undefined") return;

    // Check if we have tokens in localStorage
    const accessToken = localStorage.getItem("auth0_access_token");
    const refreshToken = localStorage.getItem("auth0_refresh_token");

    if (accessToken && refreshToken) {
      setAuthStatus("authenticated");

      // Extract user info from the access token
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        setUserEmail(payload.email);
      } catch (err) {
        console.error("Error parsing access token:", err);
      }

      return;
    }

    // If no tokens found, set status to pending and generate device code
    setAuthStatus("pending");

    // Generate a device code for authentication
    async function generateDeviceCode() {
      try {
        const response = await fetch("/api/auth/device");
        const data = await response.json();

        if (data.error) {
          setError(data.error);

          return;
        }

        setDeviceCode(data.deviceCode);
        setUserCode(data.userCode);
        // setVerificationUri(data.verificationUri);
        setVerificationUriComplete(data.verificationUriComplete);
      } catch (err: unknown) {
        console.error("Error generating device code:", err);
        setError("Failed to generate device code");
      }
    }

    generateDeviceCode();
  }, [router]);

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
            const payload = JSON.parse(atob(data.id_token.split(".")[1]));
            setUserEmail(payload.email);
          }

          setAuthStatus("authenticated");
        }
      } catch (err) {
        console.error("Error polling for tokens:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [deviceCode, authStatus]);

  const handleSignOut = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("auth0_access_token");
    localStorage.removeItem("auth0_refresh_token");

    // Reset state
    setAuthStatus("pending");
    setUserEmail(null);

    // Reload the page to restart the authentication flow
    window.location.reload();
  };

  // Use the verification URI complete from Auth0
  // const authUrl = verificationUriComplete || "";

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

  // Show loading state while checking authentication
  if (authStatus === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-center text-gray-800">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (authStatus === "authenticated") {
    return (
      <>
        <main className="min-h-screen p-4 ">
          <FlightBannerTop />
          <div className="mt-8 gap-4">
            {userEmail}
            <button
              onClick={handleSignOut}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-md"
            >
              Sign Out
            </button>
          </div>

          <div className="mt-[100px] max-w-[900px] mx-[40px] relative z-10">
            {/* Landing alert will be shown automatically when an aircraft is landing */}
            <LandingAlertManager />
            <FlightBannerBottom />
            {/* Debug panel will only be shown if debug mode is enabled */}
            {LANDING_DEBUG_MODE && <LandingDebugPanel />}
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        {/* Logo/Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/flyby-spotter-logo.png"
              alt="Flyby Spotter Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-800">FLYBY SPOTTER</h1>
          </div>
          <p className="text-gray-600 text-[16px]">
            Choose your preferred sign-in method
          </p>
        </div>

        {/* Authentication Methods */}
        <div className="grid gap-8">
          {/* QR Code Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Scan QR Code
            </h2>
            <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 transition-colors duration-200">
              {deviceCode && (
                <QRCodeSVG
                  value={verificationUriComplete || ""}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
          </div>

          {/* Verification Code Section */}
          {userCode && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Enter this code on your device:
                </p>
                <p className="text-[18px] font-mono font-bold tracking-wider text-blue-800 bg-white px-4 py-2 rounded-lg inline-block">
                  {userCode}
                </p>
              </div>
            </div>
          )}

          {/* URL Section */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-gray-700 text-center">
              Open URL Directly
            </h2>
            <button
              onClick={() => {
                if (verificationUriComplete) {
                  window.open(verificationUriComplete, "_blank");
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-yellow-500 
                       text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Click to open verification URL in new tab"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Open Authentication Page
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Having trouble? Try refreshing the page or contact support.</p>
        </div>
      </div>
    </div>
  );
}
