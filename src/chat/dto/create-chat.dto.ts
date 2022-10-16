import { IsNotEmpty } from "class-validator";

export class CreateMessageInChatRoomtDto {
    @IsNotEmpty()
    room_id: string

    @IsNotEmpty()
    user_id: string

    @IsNotEmpty()
    message: string;
}


export class JoinChatRoomDto {
    @IsNotEmpty()
    room_id: string

    @IsNotEmpty()
    user_id: string
}