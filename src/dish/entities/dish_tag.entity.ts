import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Dish } from './dish.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('dish_tags')
export class DishTag {
  @ApiProperty({ description: 'Tag ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tag name' })
  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToMany(() => Dish, (dish) => dish.tags)
  dishes: Dish[];
}
