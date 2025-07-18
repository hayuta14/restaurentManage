export class DishResponseDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    created_at: Date;
    tags: string[];
}