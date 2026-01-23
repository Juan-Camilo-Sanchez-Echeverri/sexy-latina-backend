import { Global, Module } from '@nestjs/common';

import { LogModule } from '@modules/log/log.module';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';

@Global()
@Module({
  imports: [LogModule, EventEmitterModule],
  exports: [LogModule, EventEmitterModule],
})
export class CommonModule {}
