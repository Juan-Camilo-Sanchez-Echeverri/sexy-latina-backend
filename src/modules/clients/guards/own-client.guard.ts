import type { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserRole } from '@common/enums';

import { ClientsService } from '../clients.service';

@Injectable()
export class OwnClientGuard implements CanActivate {
  constructor(private readonly clientsService: ClientsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = extractUserFromRequest(request);

    const clientId = String(request.params.id);

    const client = await this.clientsService.findOneById(clientId);

    if (currentUser?.roles.includes(UserRole.ADMIN)) return true;

    const isOwner =
      currentUser && String(currentUser._id) === String(client.user?._id);

    return Boolean(isOwner);
  }
}
