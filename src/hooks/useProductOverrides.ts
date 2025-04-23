
import { useMemo } from "react";

/**
 * Returns an override map: { [productId]: { [col]: value } }
 * from query params like ?{productId}-{column}=value
 */
export function useProductOverrides(): Record<string, Record<string, string>> {
  return useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const overrides: Record<string, Record<string, string>> = {};

    params.forEach((value, key) => {
      const match = key.match(/^([0-9a-fA-F-]{32,36})-(.+)$/);
      if (match) {
        const productId = match[1];
        const column = match[2];
        if (!overrides[productId]) overrides[productId] = {};
        overrides[productId][column] = value;
      }
    });
    return overrides;
  }, []);
}
