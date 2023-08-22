import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import { extractConfig } from '../config';

/**
 * Sentry middleware that traces all REST requests.
 */
@Injectable()
export class SentryMiddleware implements NestMiddleware {
  private useMock: boolean;

  constructor(private readonly configService: ConfigService) {
    const cfg = extractConfig(this.configService);
    this.useMock = cfg.useMockSentry;
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.useMock) {
      const transaction = Sentry.startTransaction({
        op: 'transaction',
        name: req.path,
      });

      res.on('finish', () => {
        transaction.finish();
      });
    }

    next();
  }
}
