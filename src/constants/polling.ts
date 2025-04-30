// src/constants/polling.ts

/**
 * Polling intervals for various data fetching operations
 */

// Landing data polling interval (15 seconds)
// This is for real-time aircraft landing detection
export const LANDING_DATA_POLLING_INTERVAL = 15 * 1000;

// Flight data polling interval (5 minutes)
// This is for scheduled flight information which changes less frequently
export const FLIGHT_DATA_POLLING_INTERVAL = 5 * 60 * 1000;

// UI update intervals
export const FLIGHT_ROTATION_INTERVAL = 8 * 1000; // Time to display each flight in the UI

/**
 * Landing detection thresholds
 */
// Maximum altitude for landing detection (feet)
export const LANDING_ALTITUDE_THRESHOLD = 1000; // Increased from 800

// Maximum ground speed for landing detection (knots)
export const LANDING_SPEED_THRESHOLD = 200; // Increased from 180

// Minimum vertical rate for landing detection (ft/min, negative value for descent)
export const NEGATIVE_VERTICAL_RATE_THRESHOLD = -50; // Further relaxed from -80

// Time to reset landing aircraft detection (ms)
// After this period, the same aircraft can trigger the landing alert again
export const LANDING_RESET_INTERVAL = 60 * 1000; // 1 minute

/**
 * Debug settings
 */
// Enable landing debug mode to log potential landing aircraft to a file
export const LANDING_DEBUG_MODE = true;

// Relaxed altitude threshold for debug logging (feet)
// Aircraft below this altitude will be logged even if they don't meet other landing criteria
export const LANDING_DEBUG_ALTITUDE_THRESHOLD = 1200;

// Path to the debug log file
export const LANDING_DEBUG_LOG_PATH = "/landing-debug.json";
