import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { LogService } from './log.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
