import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { APIResponseDTO, APIResponsePagingDTO } from 'src/common/DTO/APIResponseDTO';
import { Dish } from './entities/dish.entity';
import { CreateDishTagDto, UpdateDishTagDto } from './dto/create-dish-tag.dto';
import { DishTag } from './entities/dish_tag.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { DishResponseDTO } from './dto/diskResponseDTO';

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới món ăn' })
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({ status: 201, description: 'Dish created', type: APIResponseDTO })
  async create(@Body() createDishDto: CreateDishDto, @User() user: any) {
    const dish = await this.dishService.create(createDishDto);
    return new APIResponseDTO<string>(true, dish);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết món ăn theo id' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiResponse({ status: 200, description: 'Dish detail', type: APIResponseDTO })
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
  @ApiResponse({ status: 200, description: 'Danh sách món ăn', type: APIResponseDTO<Dish[]> })
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    console.log(pageNum, limitNum);
    const dish = await this.dishService.findAll(pageNum, limitNum);
    return new APIResponseDTO(true, dish);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm món ăn (fulltext + like, có phân trang)' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Từ khóa tìm kiếm', example: 'phở' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Kết quả tìm kiếm', type: APIResponsePagingDTO<DishResponseDTO[]> })
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

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({ status: 200, description: 'Dish updated', type: APIResponseDTO })
  async update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    const dish = await this.dishService.update(id, updateDishDto);
    return new APIResponseDTO<string>(true, dish);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của món ăn' })
  @ApiResponse({ status: 200, description: 'Dish deleted', type: APIResponseDTO })
  async remove(@Param('id') id: string) {
    const dish = await this.dishService.remove(id);
    return new APIResponseDTO<string>(true, dish);
  }

  //dish_tag

  @Post('tag/create')
  @ApiOperation({ summary: 'Tạo tag món ăn' })
  @ApiBody({ type: CreateDishTagDto })
  @ApiResponse({ status: 201, description: 'Dish tag created', type: APIResponseDTO })
  async createDishTag(@Body() createDishTagDto: CreateDishTagDto) {
    const dishTag = await this.dishService.createDishTag(createDishTagDto);
    return new APIResponseDTO<string>(true, dishTag);
  }

  @Get('tag/all')
  @ApiOperation({ summary: 'Lấy tất cả tag món ăn' })
  @ApiResponse({ status: 200, description: 'Danh sách tag', type: APIResponseDTO })
  async findAllDishTag() {
    const dishTag = await this.dishService.findAllDishTag();
    return new APIResponseDTO<DishTag[]>(true, dishTag);
  }

  @Delete('tag/:id')
  @ApiOperation({ summary: 'Xóa tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted', type: APIResponseDTO })
  async deleteDishTag(@Param('id') id: string) {
    const dishTag = await this.dishService.deleteDishTag(id);
    return new APIResponseDTO<string>(true, dishTag);
  }

  @Get('tag/:id')
  @ApiOperation({ summary: 'Lấy chi tiết tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiResponse({ status: 200, description: 'Tag detail', type: APIResponseDTO })
  async findOneDishTag(@Param('id') id: string) {
    const dishTag = await this.dishService.findOneDishTag(id);
    return new APIResponseDTO<DishTag>(true, dishTag);
  }

  @Patch('tag/:id')
  @ApiOperation({ summary: 'Cập nhật tag món ăn' })
  @ApiParam({ name: 'id', type: String, description: 'ID của tag' })
  @ApiBody({ type: UpdateDishTagDto })
  @ApiResponse({ status: 200, description: 'Tag updated', type: APIResponseDTO })
  async updateDishTag(@Param('id') id: string, @Body() updateDishTagDto: UpdateDishTagDto) {
    const dishTag = await this.dishService.updateDishTag(id, updateDishTagDto);
    return new APIResponseDTO<string>(true, dishTag);
  }
}
