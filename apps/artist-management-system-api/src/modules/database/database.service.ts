import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private client: Client;
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const { host, port, name, password, user } =
      this.configService.get<{
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
      }>('database') || {};

    this.client = new Client({
      host,
      port,
      user,
      password,
      database: name,
    });
    this.logger = new Logger(DatabaseService.name)
  }

  async onModuleInit() {
    await this.client
      .connect()
      .then(() => {
        this.logger.log('Database connected successfully!');
      })
      .catch((err) => {
        this.logger.error(`Failed to connect to database --> ${err}`);
      });
  }

  async query(query: string, params: any[] = []) {
    const res = await this.client.query(query, params);
    return res.rows;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
