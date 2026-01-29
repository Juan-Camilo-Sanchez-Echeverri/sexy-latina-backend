import { config } from 'dotenv';

import * as joi from 'joi';

import { resolve } from 'node:path';

import { ExecModes } from '@common/enums';

const nodeEnv = (process.env.NODE_ENV?.trim() as ExecModes) || ExecModes.LOCAL;

const envFile = nodeEnv === ExecModes.PROD ? '.env' : `.env.${nodeEnv}`;

const envPath = resolve(process.cwd(), envFile);

config({ path: envPath });

interface EnvVars {
  PORT: number;
  NODE_ENV: ExecModes;

  DB_URL: string;
  APP_URL: string;
  FRONT_PUBLIC_URL: string;
  ALLOWED_ORIGINS: string[];
  DISCORD_WEBHOOK_URL: string;

  USER_NOTIFICATIONS: string;
  PASSWORD_NOTIFICATIONS: string;

  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid(...Object.values(ExecModes))
      .default(ExecModes.LOCAL),

    DB_URL: joi.string().required(),
    DISCORD_WEBHOOK_URL: joi.string().uri().required(),
    APP_URL: joi.string().uri().required(),
    FRONT_PUBLIC_URL: joi.string().uri().required(),
    ALLOWED_ORIGINS: joi.array().items(joi.string().uri()).required(),

    USER_NOTIFICATIONS: joi.string().required(),
    PASSWORD_NOTIFICATIONS: joi.string().required(),

    REDIS_PASSWORD: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),
  })
  .unknown(true);

const result = envSchema.validate(
  { ...process.env, ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') },
  { abortEarly: false, allowUnknown: false },
);

const error = result.error;
const value = result.value as EnvVars;

if (error) {
  throw new Error(`Config validation error: \n ${error.message} in ${envFile}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv,

  dbUrl: envVars.DB_URL,
  discordWebhookUrl: envVars.DISCORD_WEBHOOK_URL,
  appUrl: envVars.APP_URL,
  frontPublicUrl: envVars.FRONT_PUBLIC_URL,
  allowedOrigins: envVars.ALLOWED_ORIGINS,

  userNotifications: envVars.USER_NOTIFICATIONS,
  passwordNotifications: envVars.PASSWORD_NOTIFICATIONS,

  redisPassword: envVars.REDIS_PASSWORD,
  redisHost: envVars.REDIS_HOST,
  redisPort: envVars.REDIS_PORT,
};
