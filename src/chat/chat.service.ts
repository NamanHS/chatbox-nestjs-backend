import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { CreateMessageInChatRoomtDto, JoinChatRoomDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {

  constructor(
    private userService: UsersService,
    private roomService: RoomsService
  ) { }

  async createMessageInChatRoom(data: CreateMessageInChatRoomtDto) {
    try {
      let { room_id, user_id, message } = data;

      let does_room_exists = await this.roomService.isRoomActive(room_id);
      if (!does_room_exists) throw new UnprocessableEntityException('Room does not exists');

      let does_user_exists = await this.userService.isUserActive(user_id);
      if (!does_user_exists) throw new UnprocessableEntityException('User does not exists');

      return {
        exception: {},
        room: {
          id: room_id,
          room_name: does_room_exists.room_name
        },
        user: {
          id: user_id,
          username: does_user_exists.username
        },
        message: {
          content: message
        }
      }

    } catch (error) {
      if (error instanceof UnprocessableEntityException) return { exception: { error }, room: {} };
      console.log('error in creating message in room', error);
      return {
        exception: { error }, room: {}
      }
    }
  }

  async joinRoom(data: JoinChatRoomDto) {
    try {
      let { room_id } = data;

      let does_room_exists = await this.roomService.isRoomActive(room_id);
      if (!does_room_exists) throw new UnprocessableEntityException('Room does not exists');

      return {
        exception: {},
        room: {
          id: room_id,
          room_name: does_room_exists.room_name
        }
      }

    } catch (error) {
      if (error instanceof UnprocessableEntityException) return { exception: { error }, room: {} };
      console.log('error in creating message in room', error);
      return {
        exception: { error }, room: {}
      }
    }
  }

}
