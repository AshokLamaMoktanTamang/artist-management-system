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
    PASETO_PUBLIC_KEY: str({ desc: 'Paseto public key is required' }),
    PASETO_PRIVATE_KEY: str({ desc: 'Paseto private key is required' }),
    PASETO_TOKEN_ISSUER: str({ default: 'AMS' }),
    PASETO_TOKEN_AUDIENCE: str({ default: 'AMS-Enduser' }),
    ASSET_BASE_URL: str({ desc: 'Asset base url needed' }),
    REDIS_HOST: str({ desc: 'Redis host required' }),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_PREFIX: str({ default: 'ams' }),
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
    paseto: {
      publicKey: env.PASETO_PUBLIC_KEY,
      privateKey: env.PASETO_PRIVATE_KEY,
      issuer: env.PASETO_TOKEN_ISSUER,
      audience: env.PASETO_TOKEN_AUDIENCE,
    },
    assets: {
      baseUrl: env.ASSET_BASE_URL,
    },
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      keyPrefix: env.REDIS_PREFIX,
    },
  };
};
