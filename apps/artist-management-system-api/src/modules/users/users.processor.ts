import * as XLSX from 'xlsx';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import {
  BULK_UPLOAD_JOB,
  DEFAULT_SEED_PASSWORD,
  USER_QUEUE,
} from './constants';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { USER_ROLE } from './interfaces';

@Processor(USER_QUEUE)
export class UsersProcessor extends WorkerHost {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case BULK_UPLOAD_JOB:
        const { fileKey } = job.data || {};
        Logger.log('Bulk upload started˝');
        this.handleBulkUpload(fileKey);
        break;

      default:
        Logger.error(job.name, ' --> not found');
        break;
    }
  }

  @OnWorkerEvent('error')
  onError(job: any, err: any) {
    Logger.error('failed --> ', job.name, JSON.stringify(err));
  }

  private async handleBulkUpload(fileKey: string) {
    const baseURL = await this.configService.get('assets.baseUrl');

    const { data } = await firstValueFrom(
      this.httpService.get(`/uploads/${fileKey}`, {
        baseURL,
        responseType: 'arraybuffer',
      })
    );

    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      try {
        await this.userService.addUser({
          ...(row as any),
          role: USER_ROLE.ARTIST,
          password: DEFAULT_SEED_PASSWORD,
          dob: new Date((row as any).dob),
        });

        Logger.log(`User added with email --> ${(row as any)?.email}`);
      } catch (error) {
        Logger.error(`Failed to add user --> ${error}`);
      }
    }

    return { message: 'Bulk upload processed', count: rows.length };
  }
}
