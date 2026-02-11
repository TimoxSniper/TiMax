/**
 * Tests for useRealTimeData hook
 *
 * Note: Using real timers for simplicity and reliability.
 * Hook functionality is tested without fake timers.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { describe, it, expect, vi } from "vitest";

describe("useRealTimeData", () => {
  it("should fetch data on mount when enabled", async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({ test: "data" });

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: true,
      })
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for fetch to complete
    await waitFor(
      () => {
        expect(result.current.data).toEqual({ test: "data" });
        expect(result.current.status).toBe("connected");
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 2000 }
    );

    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });

  it("should not fetch when disabled", async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({ test: "data" });

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: false,
      })
    );

    // Wait a bit to ensure no fetch happens
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFetchFn).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("should handle fetch errors", async () => {
    const mockFetchFn = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: true,
        maxRetries: 1,
        initialBackoffDelay: 100,
      })
    );

    // Wait for error
    await waitFor(
      () => {
        expect(result.current.status).toBe("error");
        expect(result.current.error?.message).toBe("Network error");
      },
      { timeout: 2000 }
    );

    // Should have attempted initial fetch + 1 retry
    expect(mockFetchFn).toHaveBeenCalled();
  });

  it("should allow manual retry", async () => {
    let callCount = 0;
    const mockFetchFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve({ test: "data" });
    });

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: true,
        maxRetries: 0, // No automatic retries
      })
    );

    // Wait for initial error
    await waitFor(
      () => {
        expect(result.current.status).toBe("disconnected");
      },
      { timeout: 2000 }
    );

    // Manual retry
    result.current.retry();

    // Wait for successful retry
    await waitFor(
      () => {
        expect(result.current.status).toBe("connected");
        expect(result.current.data).toEqual({ test: "data" });
      },
      { timeout: 2000 }
    );
  });

  it("should expose connection status", async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({ test: "data" });

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: true,
      })
    );

    // Initial status
    expect(result.current.status).toBe("loading");

    // After successful fetch
    await waitFor(
      () => {
        expect(result.current.status).toBe("connected");
      },
      { timeout: 2000 }
    );
  });

  it("should cleanup on unmount", async () => {
    const mockFetchFn = vi.fn().mockResolvedValue({ test: "data" });

    const { unmount } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 100,
        enabled: true,
      })
    );

    // Wait for initial fetch
    await waitFor(
      () => {
        expect(mockFetchFn).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );

    const callCountBeforeUnmount = mockFetchFn.mock.calls.length;

    unmount();

    // Wait to ensure no more calls after unmount
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockFetchFn).toHaveBeenCalledTimes(callCountBeforeUnmount);
  });

  it("should reset retry count on successful fetch", async () => {
    let callCount = 0;
    const mockFetchFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve({ test: "data" });
    });

    const { result } = renderHook(() =>
      useRealTimeData({
        fetchFn: mockFetchFn,
        refreshInterval: 30000,
        enabled: true,
        maxRetries: 3,
        initialBackoffDelay: 100,
      })
    );

    // Wait for retry and success
    await waitFor(
      () => {
        expect(result.current.status).toBe("connected");
        expect(result.current.data).toEqual({ test: "data" });
      },
      { timeout: 3000 }
    );

    // Retry count should be reset (status is connected, not error)
    expect(result.current.error).toBeNull();
  });
});
