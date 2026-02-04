import type { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserRole } from '@common/enums';

import { ModelsService } from '../models.service';

@Injectable()
export class OwnModelGuard implements CanActivate {
  constructor(private readonly modelsService: ModelsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = extractUserFromRequest(request);

    const modelId = String(request.params.id);

    const model = await this.modelsService.findOneById(modelId);

    if (currentUser?.roles.includes(UserRole.ADMIN)) return true;

    const isForbidden =
      currentUser && String(currentUser._id) === String(model.user?._id);

    return Boolean(isForbidden);
  }
}
