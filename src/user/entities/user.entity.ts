import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Dish } from 'src/dish/entities/dish.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({ description: 'Username' })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password' })
  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Role' })
  @Column()
  @IsString()
  @IsNotEmpty()
  role: string = 'user';

  @ApiProperty({ description: 'Created at' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => Dish, dish => dish.creator)
  dishes: Dish[];
}
