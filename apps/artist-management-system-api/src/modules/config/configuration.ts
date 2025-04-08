import { cleanEnv, num, str } from 'envalid';

export default () => {
  const env = cleanEnv(process.env, {
    PORT: num({ default: 3000 }),
    CORS_ALLOWED_ORIGINS: str({ default: '*' }),
    DATABASE_HOST: str({ desc: 'Database host is required' }),
    DATABASE_PORT: num({ desc: 'Database port is required' }),
    DATABASE_USER_NAME: str({ desc: 'Database username is required' }),
    DATABASE_NAME: str({ desc: 'Database name is required' }),
    DATABASE_PASSWORD: str({ default: '' }),
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
      user: env.DATABASE_USER_NAME,
      password: env.DATABASE_PASSWORD,
      name: env.DATABASE_NAME,
    },
  };
};
