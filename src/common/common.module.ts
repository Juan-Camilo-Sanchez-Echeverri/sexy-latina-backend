import { Global, Module } from '@nestjs/common';

import { CacheModule } from '@modules/cache/cache.module';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';
import { LogModule } from '@modules/log/log.module';

@Global()
@Module({
  imports: [LogModule, EventEmitterModule, CacheModule],
  exports: [LogModule, EventEmitterModule, CacheModule],
})
export class CommonModule {}
