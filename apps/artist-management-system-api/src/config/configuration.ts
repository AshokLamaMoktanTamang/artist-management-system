import { cleanEnv, num, str } from 'envalid';

export default () => {
  const env = cleanEnv(process.env, {
    PORT: num({ default: 3000 }),
    DATABASE_HOST: str({ desc: 'Database host is required' }),
    DATABASE_PORT: num({ desc: 'Database port is required' }),
    CORS_ALLOWED_ORIGINS: str({ default: '*' }),
  });

  return {
    app: {
      port: env.PORT,
      allowedOrigins: env.CORS_ALLOWED_ORIGINS.split(',')
        .filter((origin) => origin)
        .map((origin) => origin.trim()),
    },
    database: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
    },
  };
};
