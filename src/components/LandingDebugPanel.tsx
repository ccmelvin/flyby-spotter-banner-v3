"use client";

import { useState, useEffect } from "react";
import {
  LandingDebugLog,
  LandingDebugEntry,
  readLandingDebugLogs,
  LandingStatus,
  clearLandingDebugLogs,
} from "@/utils/debugLogger";
import { NEGATIVE_VERTICAL_RATE_THRESHOLD } from "@/constants/polling";

/**
 * Component to display landing debug logs
 */
export default function LandingDebugPanel() {
  const [logs, setLogs] = useState<LandingDebugLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch logs on mount and when autoRefresh is enabled
  useEffect(() => {
    const fetchLogs = () => {
      const debugLogs = readLandingDebugLogs();
      setLogs(debugLogs);
    };

    // Initial fetch
    fetchLogs();

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  // Get status color
  const getStatusColor = (status: LandingStatus, reason?: string): string => {
    switch (status) {
      case LandingStatus.ALERT_TRIGGERED:
        // Special highlight for alerts that are actually displayed
        if (reason && reason.includes("component is being displayed")) {
          return "bg-green-200 text-green-900 font-bold";
        }
        return "bg-green-100 text-green-800";
      case LandingStatus.CRITERIA_MET:
        return "bg-yellow-100 text-yellow-800";
      case LandingStatus.PARTIAL_CRITERIA:
        return "bg-orange-100 text-orange-800";
      case LandingStatus.ALTITUDE_ONLY:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to check if an entry has triggered the landing popup
  const isTriggeredFlight = (entry: LandingDebugEntry): boolean => {
    return (
      entry.status === LandingStatus.ALERT_TRIGGERED &&
      !!entry.reason &&
      entry.reason.includes("component is being displayed")
    );
  };

  // Format flight number to handle invalid formats
  const formatFlightNumber = (flight?: string): string => {
    if (!flight) return "N/A";
    // Try to match standard airline code + number format (e.g., DAL1234)
    const standardMatch = flight.trim().match(/^[A-Z]{3}(\d+)/i);
    if (standardMatch) {
      return standardMatch[1];
    }
    // For non-standard formats, check if it's a valid commercial flight number
    const commercialMatch = flight.trim().match(/(\d{1,4}[A-Z]?)/i);
    if (commercialMatch) {
      return commercialMatch[1];
    }
    // If it's not a recognizable format, return N/A
    return "N/A";
  };

  // Process logs to separate triggered flights
  const processLogs = (logs: LandingDebugLog[]): {
    triggeredFlights: Array<{ entry: LandingDebugEntry; timestamp: string }>;
    regularLogs: LandingDebugLog[];
  } => {
    const triggeredFlights: Array<{ entry: LandingDebugEntry; timestamp: string }> = [];
    // Create a deep copy of logs to avoid mutating the original
    const processedLogs = JSON.parse(JSON.stringify(logs)) as LandingDebugLog[];
    // Extract triggered flights from all logs
    processedLogs.forEach(log => {
      const triggered = log.entries.filter(entry => isTriggeredFlight(entry));
      triggered.forEach(entry => {
        triggeredFlights.push({
          entry,
          timestamp: log.last_updated
        });
      });
      // Remove triggered flights from the regular logs
      log.entries = log.entries.filter(entry => !isTriggeredFlight(entry));
    });
    // Filter out empty logs
    const regularLogs = processedLogs.filter(log => log.entries.length > 0);
    return { triggeredFlights, regularLogs };
  };

  // Format timestamp
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return timestamp;
    }
  };

  // Always render the panel, even if there are no logs yet
  const hasLogs = logs.length > 0;

  return (
    <div className="fixed bottom-0 right-0 z-40 p-4">
      <div className="bg-white rounded-lg shadow-lg border border-blue-500 overflow-hidden max-w-2xl">
        {/* Header */}
        <div
          className="bg-blue-900 text-white p-2 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="font-bold">Landing Debug Panel</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearLandingDebugLogs();
                setLogs([]);
              }}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              Clear Logs
            </button>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mr-1"
              />
              Auto-refresh
            </label>
            <span>{isExpanded ? "▼" : "▲"}</span>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="h-96 overflow-y-auto" style={{ overflowY: 'auto' }}>
            {!hasLogs && (
              <div className="p-4 text-center text-gray-500">
                <p>Waiting for landing aircraft data...</p>
                <p className="text-xs mt-2">
                  Debug logs will appear here when aircraft are detected.
                </p>
              </div>
            )}
            {/* Process logs to separate triggered flights */}
            {(() => {
              const { triggeredFlights, regularLogs } = processLogs(logs);
              return (
                <>
                  {/* Triggered Flights Section */}
                  {triggeredFlights.length > 0 && (
                    <div className="sticky top-0 z-10 bg-blue-50 border-b-2 border-blue-300 p-2">
                      <h4 className="font-bold text-blue-800 text-sm mb-2">Active Landing Alerts</h4>
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-blue-100">
                            <th className="p-1 text-left">Flight</th>
                            <th className="p-1 text-left">Alt</th>
                            <th className="p-1 text-left">Speed</th>
                            <th className="p-1 text-left">V/R</th>
                            <th className="p-1 text-left">Status</th>
                            <th className="p-1 text-left">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {triggeredFlights.map((item, index) => (
                            <tr
                              key={`triggered-${index}`}
                              className="border-t border-blue-200 bg-green-50"
                            >
                              <td className="p-1 font-bold">
                                {formatFlightNumber(item.entry.flight) || item.entry.hex.substring(0, 6)}
                              </td>
                              <td className="p-1">{item.entry.altitude}ft</td>
                              <td className="p-1">
                                {item.entry.speed !== undefined
                                  ? `${item.entry.speed}kts`
                                  : "N/A"}
                              </td>
                              <td className="p-1">
                                {item.entry.vertical_rate !== undefined ? (
                                  <span
                                    className={
                                      item.entry.vertical_rate <
                                      NEGATIVE_VERTICAL_RATE_THRESHOLD
                                        ? "text-green-600 font-bold"
                                        : "text-red-600"
                                    }
                                  >
                                    {item.entry.vertical_rate}ft/min
                                  </span>
                                ) : (
                                  <span
                                    className="text-blue-600 font-bold"
                                    title="Vertical rate not available, considered as descending"
                                  >
                                    N/A (assumed ✓)
                                  </span>
                                )}
                              </td>
                              <td className="p-1">
                                <span
                                  className={`px-1 py-0.5 rounded text-xs ${getStatusColor(
                                    item.entry.status,
                                    item.entry.reason
                                  )}`}
                                >
                                  {item.entry.status} ✓
                                </span>
                              </td>
                              <td className="p-1 text-xs">
                                {formatTime(item.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Regular Logs Section */}
                  {regularLogs.map((log, logIndex) => (
                    <div key={logIndex} className="p-2 border-b border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(log.last_updated).toLocaleString()}
                      </div>
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 text-left">Flight</th>
                            <th className="p-1 text-left">Alt</th>
                            <th className="p-1 text-left">Speed</th>
                            <th className="p-1 text-left">V/R</th>
                            <th className="p-1 text-left">Status</th>
                            <th className="p-1 text-left">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {log.entries.map((entry, entryIndex) => (
                            <tr
                              key={`${logIndex}-${entryIndex}`}
                              className="border-t border-gray-200"
                            >
                              <td className="p-1">
                                {formatFlightNumber(entry.flight) || entry.hex.substring(0, 6)}
                              </td>
                              <td className="p-1">{entry.altitude}ft</td>
                              <td className="p-1">
                                {entry.speed !== undefined
                                  ? `${entry.speed}kts`
                                  : "N/A"}
                              </td>
                              <td className="p-1">
                                {entry.vertical_rate !== undefined ? (
                                  <span
                                    className={
                                      entry.vertical_rate <
                                      NEGATIVE_VERTICAL_RATE_THRESHOLD
                                        ? "text-green-600 font-bold"
                                        : "text-red-600"
                                    }
                                  >
                                    {entry.vertical_rate}ft/min
                                  </span>
                                ) : (
                                  <span
                                    className="text-blue-600 font-bold"
                                    title="Vertical rate not available, considered as descending"
                                  >
                                    N/A (assumed ✓)
                                  </span>
                                )}
                              </td>
                              <td className="p-1">
                                <span
                                  className={`px-1 py-0.5 rounded text-xs ${getStatusColor(
                                    entry.status,
                                    entry.reason
                                  )}`}
                                  title={entry.reason}
                                >
                                  {entry.status}
                                </span>
                              </td>
                              <td className="p-1 text-xs">{entry.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
