import { ApiProperty, PickType } from '@nestjs/swagger';
import { Dish } from '../entities/dish.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateDishDto extends PickType(Dish, [
  'name',
  'price',
  'description',
  'image_url',
]) {
  @ApiProperty({ description: 'Tags ID' })
  @IsArray()
  @IsNotEmpty()
  tags_id: number[];
}
