"use client";

/**
 * useRealTimeData Hook
 *
 * A reusable hook for real-time data fetching with smart polling.
 *
 * Features:
 * - Configurable refresh intervals
 * - Smart polling (pauses when tab inactive using Page Visibility API)
 * - Error retry with exponential backoff
 * - Connection status indicator
 * - TypeScript support
 *
 * @example
 * const { data, error, status, retry } = useRealTimeData({
 *   fetchFn: () => fetch('/api/admin/dashboard').then(r => r.json()),
 *   refreshInterval: 30000, // 30 seconds
 *   enabled: true,
 * });
 */

import { useState, useEffect, useCallback, useRef } from "react";

export type ConnectionStatus = "idle" | "loading" | "connected" | "error" | "disconnected";

export interface UseRealTimeDataOptions<T> {
  /** Function to fetch data */
  fetchFn: () => Promise<T>;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Enable/disable polling */
  enabled?: boolean;
  /** Max retry attempts before giving up */
  maxRetries?: number;
  /** Initial backoff delay in ms */
  initialBackoffDelay?: number;
}

export interface UseRealTimeDataResult<T> {
  /** The fetched data */
  data: T | null;
  /** Error if fetch failed */
  error: Error | null;
  /** Connection status */
  status: ConnectionStatus;
  /** Manually trigger a refetch */
  retry: () => void;
  /** Whether currently fetching */
  isLoading: boolean;
}

export function useRealTimeData<T>({
  fetchFn,
  refreshInterval = 30000,
  enabled = true,
  maxRetries = 3,
  initialBackoffDelay = 1000,
}: UseRealTimeDataOptions<T>): UseRealTimeDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);

  const retryCount = useRef(0);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisible = useRef(true);
  const isMounted = useRef(true);

  /**
   * Calculate backoff delay with exponential growth
   */
  const getBackoffDelay = useCallback((attempt: number): number => {
    return Math.min(initialBackoffDelay * Math.pow(2, attempt), 30000);
  }, [initialBackoffDelay]);

  /**
   * Fetch data with error handling and backoff
   */
  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return;
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      if (!isRetry) {
        setStatus("loading");
      }

      const result = await fetchFn();

      if (!isMounted.current) return;

      setData(result);
      setError(null);
      setStatus("connected");
      retryCount.current = 0; // Reset retry count on success
    } catch (err) {
      if (!isMounted.current) return;

      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setError(error);
      setStatus("error");

      // Exponential backoff retry logic
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        const delay = getBackoffDelay(retryCount.current - 1);

        console.warn(
          `[useRealTimeData] Fetch failed, retry ${retryCount.current}/${maxRetries} in ${delay}ms`,
          error
        );

        setTimeout(() => {
          if (isMounted.current && enabled) {
            fetchData(true);
          }
        }, delay);
      } else {
        console.error(`[useRealTimeData] Max retries (${maxRetries}) reached`, error);
        setStatus("disconnected");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, fetchFn, maxRetries, getBackoffDelay]);

  /**
   * Manual retry function
   */
  const retry = useCallback(() => {
    retryCount.current = 0; // Reset retry count
    setError(null);
    fetchData();
  }, [fetchData]);

  /**
   * Setup polling interval
   */
  const setupPolling = useCallback(() => {
    // Clear existing timeout
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    if (!enabled) return;
    if (!isPageVisible.current) return; // Don't poll when page is hidden

    pollingTimeoutRef.current = setTimeout(() => {
      fetchData();
      setupPolling(); // Schedule next poll
    }, refreshInterval);
  }, [enabled, refreshInterval, fetchData]);

  /**
   * Page Visibility API - pause polling when tab is hidden
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;

      if (!document.hidden && enabled) {
        // Tab became visible - resume polling
        fetchData();
        setupPolling();
      } else {
        // Tab hidden - stop polling
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, fetchData, setupPolling]);

  /**
   * Initial fetch and polling setup
   */
  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }

    // Initial fetch
    fetchData();

    // Setup polling
    setupPolling();

    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [enabled, fetchData, setupPolling]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    status,
    retry,
    isLoading,
  };
}
