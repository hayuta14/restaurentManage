import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { In, Repository } from 'typeorm';
import { Dish } from './entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DishTag } from './entities/dish_tag.entity';
import { CreateDishTagDto, UpdateDishTagDto } from './dto/create-dish-tag.dto';
import { DishResponseDTO } from './dto/diskResponseDTO';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
    @InjectRepository(DishTag) private dishTagRepository: Repository<DishTag>,
  ){}
  
  async create(createDishDto: CreateDishDto) {
    const {name, price, description, image_url, tags_id} = createDishDto;
    const dish = this.dishRepository.create({name, price, description, image_url});
    const tags = await this.dishTagRepository.find({where: {id:In(tags_id)}});
    dish.tags = tags;
    console.log(dish);
    await this.dishRepository.save(dish);
    return 'New dish created successfully';
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.dishRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['tags']
    });
    const dishResponseDTO: DishResponseDTO[] = data.map((dish) => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image_url: dish.image_url,
      created_at: dish.created_at,
      tags: dish.tags.map((tag) => tag.name),
    }));
    const paging = {
      page,
      limit,
      total,
    };

    return {
      dishResponseDTO,
      paging,
    };}

  async findOne(id: string) {
    console.log('findOne called with id:', id);
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid dish id');
    }
    const dish = await this.dishRepository.findOne({where: {id:+id}});
    if(!dish){
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }

  async update(id: string, updateDishDto: UpdateDishDto) {
    const {name, price, description, image_url, tags_id} = updateDishDto;
    const dish = await this.dishRepository.findOne({where: {id:+id}, relations: ['tags']});
    if(!dish){
      throw new NotFoundException('Dish not found');
    }
    const tags = await this.dishTagRepository.find({ where: { id: In(tags_id ?? []) } });
    dish.name = name ?? dish.name;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.image_url = image_url ?? dish.image_url;
    dish.tags = tags;
    await this.dishRepository.save(dish);
    return 'Dish updated successfully';
  }

  async remove(id: string) {
    const dish = await this.dishRepository.findOne({where: {id:+id}});
    if(!dish){
      throw new NotFoundException('Dish not found');
    }
    await this.dishRepository.delete(id);
    return 'Dish deleted successfully';
  }

  async searchDish(q: string, page: number = 1, limit: number = 10) {
    if (!q || q.trim() === '') {
      return { data: [], paging: { page, limit, total: 0 } };
    }
    const offset = (page - 1) * limit;
    const qb = this.dishRepository.createQueryBuilder('dish');
    qb.where(`
      to_tsvector('simple', dish.name || ' ' || dish.description) @@ plainto_tsquery('simple', :q)
      OR LOWER(dish.name) LIKE LOWER(:likeQ)
      OR LOWER(dish.description) LIKE LOWER(:likeQ)
    `, { q, likeQ: `%${q}%` });
    qb.leftJoinAndSelect('dish.tags', 'tags');
    // Đếm tổng số kết quả
    const total = await qb.getCount();
    // Lấy dữ liệu phân trang
    qb.skip(offset).take(limit);
    const result = await qb.getMany();
    // Mapping sang DishResponseDTO
    const data: DishResponseDTO[] = result.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image_url: dish.image_url,
      created_at: dish.created_at,
      tags: dish.tags ? dish.tags.map(tag => tag.name) : [],
    }));
    return {
      data,
      paging: {
        page,
        limit,
        total,
      },
    };
  }


  //dish_tag
  async createDishTag(createDishTagDto: CreateDishTagDto) {
    const isExist = await this.dishTagRepository.findOne({where: {name:createDishTagDto.name}});
    if(isExist){
      throw new BadRequestException('Dish tag already exists');
    }
    const dishTag = this.dishTagRepository.create(createDishTagDto);
    await this.dishTagRepository.save(dishTag);
    return 'Dish tag created successfully';
  }

  async findAllDishTag() {
    const dishTag = await this.dishTagRepository.find();
    return dishTag;
  }

  async deleteDishTag(id: string) {
    const dishTag = await this.dishTagRepository.findOne({where: {id:+id}});
    if(!dishTag){
      throw new NotFoundException('Dish tag not found');
    }
    await this.dishTagRepository.delete(id);
    return 'Dish tag deleted successfully';
  }

  async findOneDishTag(id: string) {
    const dishTag = await this.dishTagRepository.findOne({where: {id:+id}});
    if(!dishTag){
      throw new NotFoundException('Dish tag not found');
    }
    return dishTag;
  }

  async updateDishTag(id: string, updateDishTagDto: UpdateDishTagDto) {
    const dishTag = await this.dishTagRepository.findOne({where: {id:+id}});
    if(!dishTag){
      throw new NotFoundException('Dish tag not found');
    }
    await this.dishTagRepository.update(id, updateDishTagDto);
    return 'Dish tag updated successfully';
  }
}
