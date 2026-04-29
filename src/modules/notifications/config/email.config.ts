import { envs } from '@configs';

export const emailConfig = {
  url: envs.emailServiceUrl,
  from: envs.userNotifications,
};
