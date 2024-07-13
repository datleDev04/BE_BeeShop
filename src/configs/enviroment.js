const development = {
  app: {
    port: process.env.DEV_APP_PORT || 8080,
  },
  db: {
    url: process.env.DEV_DB_URL,
  },
};

// môi trường product tính sau
const production = {
  app: {
    port: process.env.PRO_APP_PORT || 8080,
  },
  db: {
    url: process.env.PRO_DB_URL,
  },
};

const environment = { development, production };
export const env = process.env.NODE_ENV || 'development';

export default environment[env];
