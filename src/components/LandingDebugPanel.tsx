"use client";

import { useState, useEffect } from "react";
import {
  LandingDebugLog,
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
          <div className="max-h-96 overflow-y-auto">
            {!hasLogs && (
              <div className="p-4 text-center text-gray-500">
                <p>Waiting for landing aircraft data...</p>
                <p className="text-xs mt-2">
                  Debug logs will appear here when aircraft are detected.
                </p>
              </div>
            )}
            {logs.map((log, logIndex) => (
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
                          {entry.flight || entry.hex.substring(0, 6)}
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
                            {entry.reason && entry.reason.includes("component is being displayed") &&
                              " ✓"}
                          </span>
                        </td>
                        <td className="p-1 text-xs">{entry.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
