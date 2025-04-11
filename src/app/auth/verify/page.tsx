"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { domain, clientId, redirectUri } from "../../../auth/auth0-config";

export default function VerifyPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userCode = searchParams.get("user_code");
    const deviceCode = searchParams.get("device_code");
    
    if (!userCode || !deviceCode) {
      setError("Missing user code or device code");
      return;
    }
    
    // Redirect to Auth0 authorization page
    const authUrl = `https://${domain}/authorize?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid%20profile%20email%20offline_access` +
      `&state=${encodeURIComponent(deviceCode)}` +
      `&prompt=login`;
    
    window.location.href = authUrl;
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
            <h1 className="text-2xl font-bold text-center">Redirecting...</h1>
            <p className="text-center text-gray-500">
              Please wait while we redirect you to the login page.
            </p>
          </>
        )}
      </div>
    </div>
  );
}