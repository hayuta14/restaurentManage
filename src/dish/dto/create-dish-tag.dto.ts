import { PartialType, PickType } from '@nestjs/swagger';
import { DishTag } from '../entities/dish_tag.entity';

export class CreateDishTagDto extends PickType(DishTag, ['name']) {}

export class UpdateDishTagDto extends PartialType(CreateDishTagDto) {}
