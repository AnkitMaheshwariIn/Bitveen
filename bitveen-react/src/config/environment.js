// Dynamic environment configuration loader
import { environment as developmentEnv } from './environment.development';
import { environment as productionEnv } from './environment.production';

// Determine which environment to use based on NODE_ENV
const getEnvironment = () => {
  // NODE_ENV is automatically set by React scripts
  // 'development' for npm start, 'production' for npm run build
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  switch (nodeEnv) {
    case 'production':
      return productionEnv;
    case 'development':
    default:
      return developmentEnv;
  }
};

export const environment = getEnvironment();
