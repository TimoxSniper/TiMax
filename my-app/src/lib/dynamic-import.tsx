/**
 * Helper function to create dynamic imports with proper loading and error boundaries
 * This helps with code splitting and reduces initial bundle size
 */

import dynamic from "next/dynamic";
import type { ReactElement } from "react";

// Create a dynamic import helper
export function createDynamicImport(
  importFunction: () => Promise<any>,
  options: {
    loading?: () => ReactElement;
    ssr?: boolean;
  } = {}
) {
  const { loading, ssr = false } = options;

  return dynamic(importFunction, {
    loading: loading,
    ssr,
  });
}

// Specific dynamic imports for commonly used heavy components
export const DynamicUploadList = createDynamicImport(
  () => import("@/components/upload/upload-list"),
  {
    loading: () => (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border p-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse bg-gray-200" />
              <div className="h-3 w-1/4 animate-pulse bg-gray-200" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

export const DynamicChatInterface = createDynamicImport(
  () => import("@/components/chat/chat-interface"),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-16rem)] max-h-[800px] w-full flex-row gap-4">
        <div className="bg-card h-full w-72 flex-shrink-0 animate-pulse rounded-xl border" />
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border">
          <div className="border-b p-4">
            <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t p-4">
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const DynamicMessageList = createDynamicImport(
  () => import("@/components/chat/message-list"),
  {
    ssr: false,
  }
);
