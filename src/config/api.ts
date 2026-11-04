// API and Socket.IO base configuration

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

