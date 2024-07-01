const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8080,
  },
  db: {
    url: process.env.DEV_DB_URL,
  },
};

// môi trường product tính sau
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 8080,
  },
  db: {
    url: process.env.PRO_DB_URL,
  },
};

const environment = { dev, pro };
export const env = process.env.NODE_ENV || 'dev';

export default environment[env];
