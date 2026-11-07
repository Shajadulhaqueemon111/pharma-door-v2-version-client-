// API and Socket.IO base configuration
import axios from 'axios';

export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running locally on localhost or 127.0.0.1, use local backend on port 5001
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5001';
  }
  return 'https://pharmadoor-backend-v2.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_SERVER_URL = API_BASE_URL;

// Global Rewriter & Accelerator
// Seamlessly rewrites any hardcoded legacy vercel URLs to the active API_BASE_URL
const VERCEL_DOMAIN = 'https://pharmadoor-backend-v2.vercel.app';

if (typeof window !== 'undefined') {
  // Axios request interceptor
  axios.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith(VERCEL_DOMAIN)) {
      config.url = config.url.replace(VERCEL_DOMAIN, API_BASE_URL);
    }
    return config;
  });

  // Global window.fetch monkey-patch
  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch;
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
      if (typeof input === 'string') {
        if (input.startsWith(VERCEL_DOMAIN)) {
          input = input.replace(VERCEL_DOMAIN, API_BASE_URL);
        }
      } else if (input instanceof URL) {
        if (input.href.startsWith(VERCEL_DOMAIN)) {
          input = new URL(input.href.replace(VERCEL_DOMAIN, API_BASE_URL));
        }
      } else if (input instanceof Request) {
        if (input.url.startsWith(VERCEL_DOMAIN)) {
          input = new Request(input.url.replace(VERCEL_DOMAIN, API_BASE_URL), input);
        }
      }
      return originalFetch.call(this, input, init);
    };
  }
}
