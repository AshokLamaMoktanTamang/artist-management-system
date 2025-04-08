import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '@/modules/database/database.service';
import { QueryOptions } from './type';

@Injectable()
export class BaseRepository<T extends { id: string }> {
  private readonly logger = new Logger(BaseRepository.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly table: string,
    protected readonly schema: Record<string, string>,
    private readonly softDelete = false
  ) {
    this.initTable();
  }

  private async initTable() {
    const exists = await this.tableExists();
    if (!exists) {
      await this.createTable();
      this.logger.log(`Table created --> ${this.table}`);
    }
  }

  private async tableExists(): Promise<boolean> {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1
      );
    `;
    const result = await this.db.query(query, [this.table]);
    return result[0]?.exists ?? false;
  }

  private async createTable() {
    const columns = Object.entries(this.schema)
      .map(([key, type]) => `${key} ${type}`)
      .join(', ');
    const query = `CREATE TABLE ${this.table} (${columns});`;
    await this.db.query(query);
  }

  private buildWhereClause(
    where: Partial<T>,
    startIndex = 1
  ): { clause: string; values: any[] } {
    const keys = Object.keys(where || {});
    if (this.softDelete && !('deleted' in where)) {
      keys.push('deleted');
      where = { ...where, deleted: false };
    }

    const conditions = keys.map((key, i) => `${key} = $${i + startIndex}`);
    const clause = keys.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const values = Object.values(where || {});
    return { clause, values };
  }

  async find(options: QueryOptions<T> = {}): Promise<T[]> {
    const {
      where = {},
      limit,
      offset,
      orderBy,
      orderDirection = 'ASC',
    } = options;
    const { clause, values } = this.buildWhereClause(where);

    let query = `SELECT * FROM ${this.table} ${clause}`;
    if (orderBy) query += ` ORDER BY ${String(orderBy)} ${orderDirection}`;
    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    return this.db.query(query, values);
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    const { clause, values } = this.buildWhereClause(where);
    const query = `SELECT * FROM ${this.table} ${clause} LIMIT 1`;
    const result = await this.db.query(query, values);
    return result[0] ?? null;
  }

  async findById(id: string): Promise<T | null> {
    return this.findOne({ id } as any);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${this.table} (${keys.join(
      ', '
    )}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.db.query(query, values);
    return result[0];
  }

  async updateById(id: string, updates: Partial<T>): Promise<T> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    const query = `UPDATE ${this.table} SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id, ...values]);
    return result[0];
  }

  async deleteById(id: string): Promise<T> {
    if (this.softDelete) {
      const query = `UPDATE ${this.table} SET deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *`;
      const result = await this.db.query(query, [id]);
      return result[0];
    }

    const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id]);
    return result[0];
  }

  async count(where: Partial<T> = {}): Promise<number> {
    const { clause, values } = this.buildWhereClause(where);
    const query = `SELECT COUNT(*) FROM ${this.table} ${clause}`;
    const result = await this.db.query(query, values);
    return parseInt(result[0].count, 10);
  }

  async restoreById(id: string): Promise<T | null> {
    if (!this.softDelete) return null;
    const query = `UPDATE ${this.table} SET deleted = false, deleted_at = NULL WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id]);
    return result[0];
  }
}
