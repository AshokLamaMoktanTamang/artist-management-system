import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '@/modules/database/database.service';
import { QueryOptions } from './type';

@Injectable()
export class BaseRepository<T extends { id: string }> {
  private readonly logger = new Logger(BaseRepository.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly table: string,
    private readonly schema: Record<string, string>,
    private readonly softDelete = false,
    private readonly indexes: string[] = [],
    private readonly preSaveHook?: (
      data: Partial<Omit<T, 'id'>>,
      action?: 'create' | 'update'
    ) => Promise<Partial<Omit<T, 'id'>>>,
    private readonly virtuals?: (entity: T) => Partial<Record<string, any>>
  ) {
    this.initTable();
  }

  private async processBeforeSave(
    data: Partial<Omit<T, 'id'>>,
    action?: 'create' | 'update'
  ): Promise<Partial<Omit<T, 'id'>>> {
    return this.preSaveHook ? await this.preSaveHook(data, action) : data;
  }

  private applyVirtuals(entity: T): T & Record<string, any> {
    if (!this.virtuals) return entity;

    return {
      ...entity,
      ...this.virtuals(entity),
    };
  }

  private async initTable() {
    const exists = await this.tableExists();
    if (!exists) {
      await this.createTable();
      this.logger.log(`Table created --> ${this.table}`);
    }

    for (const indexQuery of this.indexes) {
      await this.db.query(indexQuery);
      this.logger.log(`Indexes created for --> ${this.table}`);
    }
  }

  private async tableExists(): Promise<boolean> {
    const result = await this.db.query(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = $1
       ) AS "exists"`,
      [this.table]
    );

    return result?.[0]?.exists === true;
  }

  private async createTable() {
    const columns = Object.entries(this.schema)
      .map(([column, type]) => `"${column}" ${type}`)
      .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS "${this.table}" (${columns});`;
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

  private buildSelectClause(select?: Partial<Record<keyof T, 0 | 1>>): string {
    if (!select) return '*';

    const included = Object.entries(select)
      .filter(([_, v]) => v === 1)
      .map(([k]) => `"${k}"`);

    const excluded = Object.entries(select)
      .filter(([_, v]) => v === 0)
      .map(([k]) => k);

    if (included.length > 0) return included.join(', ');

    const allKeys = Object.keys(this.schema);
    const final = allKeys
      .filter((k) => !excluded.includes(k))
      .map((k) => `"${k}"`);

    return final.join(', ');
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

    return (await this.db.query(query, values)).map((row) =>
      this.applyVirtuals(row)
    );
  }

  async findOne(
    where: Partial<T>,
    select?: Partial<Record<keyof T, 0 | 1>>
  ): Promise<T | null> {
    const selectedFields = this.buildSelectClause(select);
    const { clause, values } = this.buildWhereClause(where);
    const query = `SELECT ${selectedFields} FROM ${this.table} ${clause} LIMIT 1`;
    const result = await this.db.query(query, values);
    return result[0] ? this.applyVirtuals(result[0]) : null;
  }

  async findById(
    id: string,
    select?: Partial<Record<keyof T, 0 | 1>>
  ): Promise<T | null> {
    return this.findOne({ id } as any, select);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const processed = await this.processBeforeSave(data, 'create');

    const keys = Object.keys(processed);
    const values = Object.values(processed);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${this.table} (${keys.join(
      ', '
    )}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.db.query(query, values);
    return result[0];
  }

  async updateById(id: string, unprocessedUpdates: Partial<T>): Promise<T> {
    const row = await this.findById(id);

    if (!row) throw new NotFoundException('Data not found');

    const updates = await this.processBeforeSave(unprocessedUpdates, 'update');

    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    const query = `UPDATE ${this.table} SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id, ...values]);
    return this.applyVirtuals(result[0]);
  }

  async deleteById(id: string): Promise<T> {
    const row = await this.findById(id);

    if (!row) throw new NotFoundException('Data not found');

    if (this.softDelete) {
      const query = `UPDATE ${this.table} SET deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING *`;
      const result = await this.db.query(query, [id]);
      return this.applyVirtuals(result[0]);
    }

    const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id]);
    return this.applyVirtuals(result[0]);
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
