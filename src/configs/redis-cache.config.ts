import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';

import { createKeyvNonBlocking } from '@keyv/redis';

import { envs } from './envs.config';

export class RedisCacheConfig implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    const keyvStore = createKeyvNonBlocking({
      password: envs.redisPassword,
      socket: {
        host: envs.redisHost,
        port: envs.redisPort,
      },
    });

    keyvStore.on('error', (error) => {
      console.error('Keyv Redis error:', error);
    });

    return { stores: [keyvStore] };
  }
}
