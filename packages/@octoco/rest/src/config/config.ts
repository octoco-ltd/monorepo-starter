import { ConfigService } from '@nestjs/config';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  validateOrReject,
} from 'class-validator';

export class Config {
  @ValidateIf((cfg) => !cfg.useInMemoryDb)
  @IsNotEmpty()
  databaseUrl?: string;

  @ValidateIf((cfg) => !!cfg.databaseUrl)
  @Equals(false)
  useInMemoryDb: boolean;

  @ValidateIf((cfg) => !cfg.useMockFirebase)
  @IsNotEmpty()
  firebaseProjectId?: string;

  @ValidateIf((cfg) => !cfg.useMockFirebase)
  @IsNotEmpty()
  @IsEmail()
  firebaseClientEmail?: string;

  @ValidateIf((cfg) => !cfg.useMockFirebase)
  @IsNotEmpty()
  firebasePrivateKey?: string;

  @ValidateIf((cfg) => !!cfg.firebaseProjectId)
  @ValidateIf((cfg) => !!cfg.firebaseClientEmail)
  @ValidateIf((cfg) => !!cfg.firebasePrivateKey)
  @Equals(false)
  useMockFirebase: boolean;
}

export const getConfig = async () => {
  const cfg = new Config();
  cfg.databaseUrl = process.env.DATABASE_URL;
  cfg.useInMemoryDb = !!JSON.parse(process.env.USE_IN_MEMORY_DB ?? 'false');
  cfg.firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  cfg.firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  cfg.firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  cfg.useMockFirebase = !!JSON.parse(process.env.USE_MOCK_FIREBASE ?? 'false');

  await validateOrRejectWrapper(cfg);
  return {
    config: cfg,
  };
};

export const getConfigForTesting = async () => {
  if (process.env.DATABASE_URL) {
    console.warn(
      `Environment variable 'DATABASE_URL' is ignored for testing. If you meant to connect to a database, set DATABASE_TEST_URL.`,
    );
  }

  const cfg = new Config();
  cfg.databaseUrl = process.env.DATABASE_TEST_URL;
  cfg.useInMemoryDb = !process.env.DATABASE_TEST_URL;
  cfg.useMockFirebase = true;

  await validateOrRejectWrapper(cfg);
  return {
    config: cfg,
  };
};

export function extractConfig(configService: ConfigService): Config {
  return configService.get('config');
}

async function validateOrRejectWrapper(cfg: Config) {
  try {
    await validateOrReject(cfg);
  } catch (errs) {
    let msg =
      'The application config is invalid, check your .env or environment variables:\n\n';
    for (const err of errs) {
      msg += `${err}\n`;
    }

    throw new Error(msg);
  }
}
