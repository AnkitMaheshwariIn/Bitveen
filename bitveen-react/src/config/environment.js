/**
 * Dynamic environment configuration loader
 * 
 * This file loads environment variables from .env files via the process.env object
 * React automatically loads variables prefixed with REACT_APP_ from .env files
 */

// Create a unified environment configuration object from environment variables
export const environment = {
  api: {
    // Default to localhost if not defined
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'
  },
  app: {
    // Default app name if not defined
    name: process.env.REACT_APP_APP_NAME || 'Bitveen'
  },
  auth: {
    // Google OAuth client ID
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || ''
  }
};

// Log the current environment (but not sensitive values)
console.log(`Running in ${process.env.NODE_ENV || 'development'} environment`);
console.log(`API Base URL: ${environment.api.baseUrl}`);
console.log(`App Name: ${environment.app.name}`);

