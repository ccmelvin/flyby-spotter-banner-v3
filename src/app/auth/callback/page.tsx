"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForTokens } from "../../../auth/auth-utils";
import { redirectUri } from "../../../auth/auth0-config";

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state"); // This contains the device code
        
        if (!code || !state) {
          setError("Missing authorization code or state");
          return;
        }
        
        // Exchange the authorization code for tokens
        const tokens = await exchangeCodeForTokens(code, redirectUri);
        
        if (tokens.error) {
          setError(tokens.error_description || tokens.error);
          return;
        }
        
        // Get user info from the ID token
        const idToken = tokens.id_token;
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const userId = payload.sub;
        const email = payload.email;
        
        // Update the device session with the tokens
        const response = await fetch("/api/auth/device", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceCode: state,
            userId,
            email,
            refreshToken: tokens.refresh_token,
            accessToken: tokens.access_token,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to update device session");
        }
        
        // Show success message
        setError(null);
        
        // Close this window after a short delay
        setTimeout(() => {
          window.close();
        }, 3000);
      } catch (err) {
        console.error("Error in callback:", err);
        setError("Failed to complete authentication");
      }
    }
    
    handleCallback();
  }, [searchParams, router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600">Error</h1>
            <p className="text-center text-gray-500">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-green-600">
              Authentication Successful!
            </h1>
            <p className="text-center text-gray-500">
              You can now close this window and return to your device.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
