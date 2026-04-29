import { Controller, Post, Body } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ApiCreatedResponseWrapper, Public } from '@common/decorators';

import { ClientResponse } from '@modules/clients/responses/client.response';

import { RegisterService } from './register.service';

import { RegisterModelDto, RegisterClientDto } from './dto';

import { ModelResponse } from '../models/responses';

@Public()
@ApiTags('register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  /**
   * Register a new model
   *
   * @remarks Register a new model profile with the provided information.
   */
  @Post('models')
  @ApiCreatedResponseWrapper(ModelResponse)
  async registerModel(@Body() registerModelDto: RegisterModelDto) {
    return this.registerService.registerModel(registerModelDto);
  }

  /**
   * Register a new client
   *
   * @remarks Register a new client profile with the provided information.
   */
  @Post('clients')
  @ApiCreatedResponseWrapper(ClientResponse)
  async registerClient(@Body() registerClientDto: RegisterClientDto) {
    return this.registerService.registerClient(registerClientDto);
  }
}
