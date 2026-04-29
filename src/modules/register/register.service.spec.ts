import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { RegisterService } from './register.service';
import { UsersService } from '@modules/users/users.service';
import { ModelsService } from '@modules/models/models.service';
import { ClientsService } from '@modules/clients/clients.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        { provide: getConnectionToken(), useValue: { startSession: jest.fn() } },
        { provide: UsersService, useValue: {} },
        { provide: ModelsService, useValue: {} },
        { provide: ClientsService, useValue: {} },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
