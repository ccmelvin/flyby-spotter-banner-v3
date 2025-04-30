// src/utils/debugLogger.ts

/**
 * Utility functions for debug logging
 */

/**
 * Status types for landing aircraft debug logs
 */
export enum LandingStatus {
  ALERT_TRIGGERED = "alert_triggered", // Met all criteria AND triggered an alert
  CRITERIA_MET = "criteria_met", // Met all landing criteria but didn't trigger an alert
  PARTIAL_CRITERIA = "partial_criteria", // Met some but not all landing criteria
  ALTITUDE_ONLY = "altitude_only", // Only met the debug altitude threshold
}

/**
 * Interface for landing debug log entry
 */
export interface LandingDebugEntry {
  hex: string;
  flight?: string;
  altitude: number;
  speed?: number;
  vertical_rate?: number;
  status: LandingStatus;
  reason: string;
  timestamp: string;
}

/**
 * Interface for landing debug log file
 */
export interface LandingDebugLog {
  entries: LandingDebugEntry[];
  last_updated: string;
}

/**
 * Write landing debug data to a file
 * @param path Path to the debug log file
 * @param entries Array of landing debug entries
 */
export async function writeLandingDebugLog(
  path: string,
  entries: LandingDebugEntry[]
): Promise<void> {
  try {
    // Create a new log object
    const logData: LandingDebugLog = {
      entries,
      last_updated: new Date().toISOString(),
    };

    // In browser environment, we can't directly write to the filesystem
    // Instead, we'll use the browser's console.log and localStorage
    console.log("[DEBUG] Landing aircraft data:", logData);
    console.log("[DEBUG] Storing landing debug data in localStorage");

    // Store in localStorage with a timestamp
    const key = `landing-debug-${new Date().getTime()}`;
    localStorage.setItem(key, JSON.stringify(logData));

    // Log the localStorage keys for debugging
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("landing-debug-")
    );
    console.log(
      `[DEBUG] Current landing debug logs in localStorage: ${allKeys.length} entries`
    );
    console.log(`[DEBUG] localStorage keys: ${allKeys.join(", ")}`);

    // Keep only the last 10 debug logs in localStorage
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith("landing-debug-"))
      .sort()
      .reverse();

    if (keys.length > 10) {
      keys.slice(10).forEach((k) => localStorage.removeItem(k));
    }

    // In a real production environment, we would send this data to a server endpoint
    // that would write it to a file or database
    // fetch('/api/debug-log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logData)
    // });
  } catch (error) {
    console.error("Error writing landing debug log:", error);
  }
}

/**
 * Read landing debug logs from localStorage
 * @returns Array of landing debug logs
 */
export function readLandingDebugLogs(): LandingDebugLog[] {
  try {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith("landing-debug-"))
      .sort()
      .reverse();

    console.log(
      `[DEBUG] Reading ${keys.length} landing debug logs from localStorage`
    );

    if (keys.length === 0) {
      console.log("[DEBUG] No landing debug logs found in localStorage");
    }

    const logs = keys
      .map((key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      })
      .filter(Boolean);

    console.log(
      `[DEBUG] Successfully parsed ${logs.length} landing debug logs`
    );
    return logs;
  } catch (error) {
    console.error("Error reading landing debug logs:", error);
    return [];
  }
}

// Helper function to clear all debug logs from localStorage
export function clearLandingDebugLogs(): void {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("landing-debug-")
    );
    console.log(
      `[DEBUG] Clearing ${keys.length} landing debug logs from localStorage`
    );

    keys.forEach((key) => localStorage.removeItem(key));

    console.log("[DEBUG] All landing debug logs cleared from localStorage");
  } catch (error) {
    console.error("Error clearing landing debug logs:", error);
  }
}
