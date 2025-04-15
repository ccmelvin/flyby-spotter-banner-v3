// Auth0 configuration
export const domain = "dev-jjyf3yzbfxkq5s1m.us.auth0.com";
export const clientId = "ZyPqGET2BOkPRfnG4iGYxoaH96HHKztj";
export const audience = "wss://flyby.colonmelvin.com:8000";
export const scope = "openid profile email offline_access"; // Include offline_access for refresh tokens
export const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";


// Create a constant for the storage key using these values
export const AUTH_STORAGE_KEY = `@@auth0spajs@@::${clientId}::${audience}::openid profile email offline_access`;