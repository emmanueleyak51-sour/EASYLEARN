import React from 'react';

/**
 * Wraps React.lazy with an automatic single-retry fallback so transient mobile network
 * glitches or service-worker cache updates do not stall screen navigation.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      return await importer();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return await importer();
    }
  });
}
