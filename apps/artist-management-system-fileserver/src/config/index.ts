import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  FILE_SERVER_PORT: port({ default: 3005 }),
  FILE_SERVER_HOST: str({ desc: 'File server host needed' }),
  STORAGE_DIR: str({ desc: 'Storage directory needed' }),
  FILE_SERVER_SECRET: str({ desc: 'File Storage secret needed' }),
});
