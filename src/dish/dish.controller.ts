import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import {
  APIResponseDTO,
  APIResponsePagingDTO,
} from '../common/DTO/APIResponseDTO';
import { Dish } from './entities/dish.entity';
import { CreateDishTagDto, UpdateDishTagDto } from './dto/create-dish-tag.dto';
import { DishTag } from './entities/dish_tag.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DishResponseDTO } from './dto/diskResponseDTO';
import {
  ApiResponseWithArrayModel,
  ApiResponseWithModel,
} from '../common/decorators/swagger.decorator';

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới món ăn' })
  @ApiBody({ type: CreateDishDto })
  @ApiResponseWithModel(String, 201)
  async create(@Body() createDishDto: CreateDishDto, @User() user: any) {
    const dish = await this.dishService.create(createDishDto);
    return new APIResponseDTO<string>(true, dish);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Lấy chi tiết món ăn theo id' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiResponseWithModel(Dish, 200)
  async findOne(@Param('id') id: string) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid dish id');
    }
    const dish = await this.dishService.findOne(id);
    return new APIResponseDTO<Dish>(true, dish);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy danh sách món ăn (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponseWithArrayModel(DishResponseDTO, 200)
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    console.log(pageNum, limitNum);
    const dish = await this.dishService.findAll(pageNum, limitNum);
    return new APIResponsePagingDTO<DishResponseDTO[]>(
      true,
      dish.dishResponseDTO,
      dish.paging,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm món ăn (fulltext + like, có phân trang)' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Từ khóa tìm kiếm',
    example: 'phở',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponseWithArrayModel(DishResponseDTO, 200)
  async searchDish(
    @Query('q') q: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const result = await this.dishService.searchDish(q, pageNum, limitNum);
    return new APIResponsePagingDTO(true, result.data, result.paging);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Cập nhật món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponseWithModel(String, 200)
  async update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    const dish = await this.dishService.update(id, updateDishDto);
    return new APIResponseDTO<string>(true, dish);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xóa món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiResponseWithModel(String, 200)
  async remove(@Param('id') id: string) {
    const dish = await this.dishService.remove(id);
    return new APIResponseDTO<string>(true, dish);
  }

  //dish_tag

  @Post('tag/create')
  @ApiOperation({ summary: 'Tạo tag món ăn' })
  @ApiBody({ type: CreateDishTagDto })
  @ApiResponseWithModel(String, 201)
  async createDishTag(@Body() createDishTagDto: CreateDishTagDto) {
    const dishTag = await this.dishService.createDishTag(createDishTagDto);
    return new APIResponseDTO<string>(true, dishTag);
  }

  @Get('tag/all')
  @ApiOperation({ summary: 'Lấy tất cả tag món ăn' })
  @ApiResponseWithArrayModel(DishTag, 200)
  async findAllDishTag() {
    const dishTag = await this.dishService.findAllDishTag();
    return new APIResponseDTO<DishTag[]>(true, dishTag);
  }

  @Delete('tag/delete/:id')
  @ApiOperation({ summary: 'Xóa tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiResponseWithModel(String, 200)
  async deleteDishTag(@Param('id') id: string) {
    const dishTag = await this.dishService.deleteDishTag(id);
    return new APIResponseDTO<string>(true, dishTag);
  }

  @Get('tag/detail/:id')
  @ApiOperation({ summary: 'Lấy chi tiết tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiResponseWithModel(DishTag, 200)
  async findOneDishTag(@Param('id') id: string) {
    const dishTag = await this.dishService.findOneDishTag(id);
    return new APIResponseDTO<DishTag>(true, dishTag);
  }

  @Patch('tag/update/:id')
  @ApiOperation({ summary: 'Cập nhật tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiBody({ type: UpdateDishTagDto })
  @ApiResponseWithModel(String, 200)
  async updateDishTag(
    @Param('id') id: string,
    @Body() updateDishTagDto: UpdateDishTagDto,
  ) {
    const dishTag = await this.dishService.updateDishTag(id, updateDishTagDto);
    return new APIResponseDTO<string>(true, dishTag);
  }
}
