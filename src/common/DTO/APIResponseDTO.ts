import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class APIResponseDTO<T> {
  constructor(success: boolean, data: T) {
    this.success = success;
    this.data = data;
  }
  @ApiProperty({ description: 'Success status' })
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;
  @ApiProperty({ description: 'DAta' })
  @IsNotEmpty()
  data: T;
}

export class APIResponseDTOWithPagination<T> {
  constructor(success: boolean, data: T, metadata: string[]) {
    this.success = success;
    this.data = data;
    this.metadata = metadata;
  }
  @ApiProperty({ description: 'Success status' })
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;
  @ApiProperty({ description: 'DAta' })
  @IsNotEmpty()
  data: T;

  @ApiProperty({ description: 'Metadata' })
  @IsObject()
  @IsNotEmpty()
  metadata: string[];
}

export class APIResponsePagingDTO<T> {
  constructor(
    success: boolean,
    data: T,
    paging: { page: number; limit: number; total: number },
  ) {
    this.success = success;
    this.data = data;
    this.paging = paging;
  }
  @ApiProperty({ description: 'Success status' })
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @ApiProperty({ description: 'Data' })
  @IsNotEmpty()
  data: T;

  @ApiProperty({
    description: 'Paging info',
    example: { page: 1, limit: 10, total: 100 },
  })
  @IsObject()
  @IsNotEmpty()
  paging: { page: number; limit: number; total: number };
}
