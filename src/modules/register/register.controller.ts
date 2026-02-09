import { Controller, Post, Body } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ApiCreatedResponseWrapper, Public } from '@common/decorators';

import { RegisterService } from './register.service';

import { RegisterModelDto } from './dto';
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
}
