/**
 * Configuration loader using environment variables
 * 
 * This file loads configuration from environment variables
 * with sensible defaults for local development
 */

// Determine which environment to use
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create configuration object from environment variables
// Throw error if required environment variables are missing
const config = {
  PORT_HTTP: parseInt(process.env.PORT_HTTP || '8000'),
  PORT_HTTPS: parseInt(process.env.PORT_HTTPS || '8443'),
  DB_URI: process.env.DB_URI,
  CNONCE: process.env.CNONCE,
  CLIENT_ID: process.env.CLIENT_ID,
  // Parse comma-separated origins from environment variable
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
  ENV: NODE_ENV
};

// Validate required environment variables
if (!config.DB_URI) {
  console.error('ERROR: DB_URI environment variable is required');
  process.exit(1);
}

if (!config.CLIENT_ID) {
  console.error('ERROR: CLIENT_ID environment variable is required');
  process.exit(1);
}

if (config.ALLOWED_ORIGINS.length === 0) {
  console.error('ERROR: ALLOWED_ORIGINS environment variable is required');
  process.exit(1);
}

// Export the configuration
module.exports = config;

// Log the current environment being used (without sensitive values)
console.log(`Using ${config.ENV} environment configuration`);
console.log(`HTTP Port: ${config.PORT_HTTP}, HTTPS Port: ${config.PORT_HTTPS}`);
console.log(`Allowed Origins: ${config.ALLOWED_ORIGINS.join(', ')}`);

