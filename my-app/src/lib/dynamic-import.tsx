/**
 * Helper function to create dynamic imports with proper loading and error boundaries
 * This helps with code splitting and reduces initial bundle size
 */

import dynamic from 'next/dynamic';

// Create a generic dynamic import helper
export function createDynamicImport<T>(
  importFunction: () => Promise<T>,
  options: {
    loading?: () => JSX.Element;
    ssr?: boolean;
    suspense?: boolean;
  } = {}
) {
  const { loading, ssr = false, suspense } = options;

  return dynamic(importFunction, {
    loading: loading,
    ssr,
    suspense,
  });
}

// Specific dynamic imports for commonly used heavy components
export const DynamicUploadList = createDynamicImport(
  () => import('@/components/upload/upload-list'),
  {
    loading: () => (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border p-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 animate-pulse" />
              <div className="h-3 w-1/4 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

export const DynamicChatInterface = createDynamicImport(
  () => import('@/components/chat/chat-interface'),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-16rem)] max-h-[800px] w-full flex-row gap-4">
        <div className="bg-card h-full w-72 flex-shrink-0 animate-pulse rounded-xl border" />
        <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border">
          <div className="border-b p-4">
            <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t p-4">
            <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const DynamicMessageList = createDynamicImport(
  () => import('@/components/chat/message-list'),
  {
    ssr: false,
  }
);