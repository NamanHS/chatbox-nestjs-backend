import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateRoomDto {
    @IsNotEmpty()
    user_id: string

    @IsNotEmpty()
    room_name: string

    @IsNotEmpty()
    description: string
}

export class FindRoomDto {
    @IsOptional()
    room_name: string

    @IsOptional()
    readonly page: number;

    @IsOptional()
    readonly limit: number;
}