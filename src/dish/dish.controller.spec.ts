import { Test, TestingModule } from '@nestjs/testing';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { DishTag } from './entities/dish_tag.entity';
import { Repository } from 'typeorm';

describe('DishController', () => {
  let controller: DishController;
  let service: DishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishController],
      providers: [
        DishService,
        {
          provide: getRepositoryToken(Dish),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DishTag),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<DishController>(DishController);
    service = module.get<DishService>(DishService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
