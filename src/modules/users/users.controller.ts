import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiConflictResponseWrapper,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Roles,
} from '@common/decorators';

import { Status } from '@common/enums';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';

import { OwnUserGuard } from './guards/own-user.guard';

import { FilterUserPipe } from './pipes';

import { UsersService } from './users.service';

import { UserResponse } from './responses/user.response';
import { UsersExamples } from './swagger/users.examples';
import { UsersErrors } from './errors/users.errors';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create an user
   *
   * @remarks this operation creates a new user with the provided data.
   *
   * <b>Only users with the SUPER_ADMIN role can access this endpoint.</b>
   */
  @Post()
  @Roles('ADMIN')
  @ApiCreatedResponseWrapper(UserResponse)
  @ApiConflictResponseWrapper(UsersExamples.conflictResponse)
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  /**
   * List all users
   *
   * @remarks this operation returns a paginated list of users and allows filtering by role, grade, and institution.
   *
   * <b>Only users with the COORDINATOR_SUPPORT or VISITOR_SUPPORT roles can access this endpoint.</b>
   *
   */
  @Get()
  @Roles('ADMIN')
  @ApiOkResponseWrapper(UserResponse, { isPaginate: true })
  async findAll(@Query(FilterUserPipe) params: FilterUsersDto) {
    return this.usersService.findPaginate(params);
  }

  /**
   * Get an user by id
   *
   * @remarks this operation retrieves an user by its id.
   *
   * <b>Users can only access their own user data through this endpoint.</b>
   */
  @Get(':id')
  @AllRoles()
  @ApiOkResponseWrapper(UserResponse, { isPaginate: false })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiNotFoundResponseWrapper(UsersErrors.USER_NOT_FOUND)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  /**
   * Update an user by id
   *
   *  @remarks this operation updates an user by its id with the provided data.
   *
   * <b>Users can only update their own user data through this endpoint.</b>
   */
  @Patch(':id')
  @AllRoles()
  @UseGuards(OwnUserGuard)
  @ApiOkResponseWrapper(UserResponse, { isPaginate: false })
  @ApiNotFoundResponseWrapper(UsersErrors.USER_NOT_FOUND)
  @ApiConflictResponseWrapper(UsersExamples.conflictResponse)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userUpdated = await this.usersService.update(id, updateUserDto);

    return userUpdated;
  }

  /**
   * Soft-delete a user by id
   *
   * @remarks this operation performs a soft-delete by updating the user's status to DELETED instead of removing the record from the database.
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiNoContentResponseWrapper()
  @ApiNotFoundResponseWrapper(UsersErrors.USER_NOT_FOUND)
  async remove(@Param('id') id: string) {
    return this.usersService.update(id, { status: Status.DELETED });
  }
}
