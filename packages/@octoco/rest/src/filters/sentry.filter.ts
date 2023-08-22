import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { extractConfig } from '../config';

/**
 * Sentry filter that records all exceptions.
 */
@Catch()
@Injectable()
export class SentryFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private useMock: boolean;

  constructor(private readonly configService: ConfigService) {
    super();

    const cfg = extractConfig(this.configService);
    this.useMock = cfg.useMockSentry;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (!this.useMock) {
      Sentry.captureException(exception);
    }

    // pass-through to the default exception handler:
    super.catch(exception, host);
  }
}
