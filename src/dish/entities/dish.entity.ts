import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { DishTag } from './dish_tag.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity('dishes')
export class Dish {
  @ApiProperty({ description: 'Dish ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name' })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description' })
  @Column('text')
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Price' })
  @Column('decimal')
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Image URL' })
  @Column('text', { nullable: true })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToMany(() => DishTag, (tag) => tag.dishes, { cascade: true })
  @JoinTable({
    name: 'dish_tag_map',
    joinColumn: { name: 'dish_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: DishTag[];

  @ApiProperty({ description: 'Created at' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
