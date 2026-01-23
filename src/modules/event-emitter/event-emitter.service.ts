import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventPayloads } from '@common/interfaces';

@Injectable()
export class EventEmitterService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends keyof EventPayloads>(
    event: K,
    payload: EventPayloads[K],
  ): boolean {
    return this.eventEmitter.emit(String(event), payload);
  }

  async emitAsync<K extends keyof EventPayloads>(
    event: K,
    payload: EventPayloads[K],
  ): Promise<void> {
    await this.eventEmitter.emitAsync(String(event), payload);
  }
}
