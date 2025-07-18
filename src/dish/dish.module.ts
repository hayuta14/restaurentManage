import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { DishTag } from './entities/dish_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish,DishTag])],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
