import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { DishTag } from './entities/dish_tag.entity';
import { Repository } from 'typeorm';

describe('DishService', () => {
  let service: DishService;
  let dishRepo: Repository<Dish>;
  let dishTagRepo: Repository<DishTag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<DishService>(DishService);
    dishRepo = module.get<Repository<Dish>>(getRepositoryToken(Dish));
    dishTagRepo = module.get<Repository<DishTag>>(getRepositoryToken(DishTag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
