// src/auth/token-utils.ts
import { AUTH_STORAGE_KEY } from '../../auth/auth0-config';

export const getAccessToken = async () => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedAuth) {
      throw new Error('No authentication data found');
    }

    const authData = JSON.parse(storedAuth);
    if (!authData.body.access_token) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    const payload = JSON.parse(atob(authData.body.access_token.split(".")[1]));
    const expirationDate = new Date(payload.exp * 1000);
    
    if (expirationDate <= new Date()) {
      throw new Error('Token expired');
    }

    return authData.body.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};
