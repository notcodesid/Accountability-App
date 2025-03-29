// Environment configuration for the app

// API endpoints
export const API_URL = 'http://localhost:5000/api';

// In a production app, you would have different environments
export const isDevelopment = true;

// Helper for consistent logging across the app
export const logDebug = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

export const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error || '');
}; 