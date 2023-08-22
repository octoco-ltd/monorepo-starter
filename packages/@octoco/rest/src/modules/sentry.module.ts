import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { extractConfig } from '../config';

const sentryProvider: Provider = {
  provide: 'SENTRY_PROVIDER',
  useFactory: async (cfgService: ConfigService) => {
    const cfg = extractConfig(cfgService);
    if (!cfg.useMockSentry) {
      Sentry.init({
        dsn: cfg.sentryDSN,
        tracesSampleRate: 1.0,
        integrations: [new Sentry.Integrations.Http({ tracing: true })],
      });
    }
  },
  inject: [ConfigService],
};

@Module({
  providers: [ConfigService, sentryProvider],
})
export class SentryModule {}
