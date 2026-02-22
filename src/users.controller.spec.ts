import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // আমরা UsersService কেও এখানে দিতে পারি অথবা Mock করতে পারি
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
        // PrismaService এখানে দেওয়া বাধ্যতামূলক কারণ Controller এটি খুঁজছে
        {
          provide: PrismaService,
          useValue: {
            // প্রয়োজন হলে এখানে Prisma এর মেথডগুলো mock করতে পারেন
          },
        },
        // Cache Manager ও এখানে দিতে হবে
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
