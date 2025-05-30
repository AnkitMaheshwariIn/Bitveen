// Determine which environment to use
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load the appropriate environment configuration
let envConfig;
if (NODE_ENV === 'production') {
  envConfig = require('./environment.production');
} else {
  envConfig = require('./environment.development');
}

// Export all configuration values from the environment config
module.exports = envConfig;

// Log the current environment being used
console.log(`Using ${envConfig.ENV} environment configuration`);
