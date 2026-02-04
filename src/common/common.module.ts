import { Global, Module } from '@nestjs/common';

import { CacheModule } from '@modules/cache/cache.module';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';
import { LogModule } from '@modules/log/log.module';
import { StorageModule } from '@modules/storage/storage.module';

@Global()
@Module({
  imports: [LogModule, EventEmitterModule, CacheModule, StorageModule],
  exports: [LogModule, EventEmitterModule, CacheModule, StorageModule],
})
export class CommonModule {}
