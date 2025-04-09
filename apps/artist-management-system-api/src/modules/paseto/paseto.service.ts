import { ConsumeOptions, ProduceOptions, V4 } from 'paseto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasetoService {
  private readonly secretKey: string;
  private readonly publicKey: string;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('paseto.privateKey')!;
    this.publicKey = this.configService.get<string>('paseto.publicKey')!;
    this.issuer = this.configService.get<string>('paseto.issuer')!;
    this.audience = this.configService.get<string>('paseto.audience')!;
  }

  async generateToken(
    payload: Record<string, any>,
    produceOption?: ProduceOptions & { noExpiry?: boolean }
  ): Promise<string> {
    const {
      expiresIn = '1 hours',
      issuer = this.issuer,
      iat = true,
      audience = this.audience,
      noExpiry,
      ...options
    } = produceOption || {};
    return V4.sign(payload, this.secretKey, {
      ...options,
      expiresIn: noExpiry ? undefined : expiresIn,
      iat,
      issuer,
    });
  }

  async verifyToken(
    token: string,
    consumeOption?: ConsumeOptions<true>
  ): Promise<Record<string, any>> {
    try {
      const {
        issuer = this.issuer,
        audience = this.audience,
        ...options
      } = consumeOption || {};
      return await V4.verify(token, this.publicKey, { ...options, issuer });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
