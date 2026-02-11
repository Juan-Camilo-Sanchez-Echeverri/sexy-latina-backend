import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { Client, ClientDocument } from '../schemas/client.schema';

@Injectable()
export class ClientsRepository extends EntityRepository<ClientDocument> {
  constructor(
    @InjectModel(Client.name)
    protected readonly clientModel: PaginateModel<ClientDocument>,
  ) {
    super(clientModel);
  }
}
