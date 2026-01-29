import { Module } from '@nestjs/common';

import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

import { RedisCacheConfig } from '@configs';

import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useClass: RedisCacheConfig,
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
