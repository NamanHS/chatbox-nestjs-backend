import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto, FindRoomDto } from './dto/room.dto';
import { Model, ObjectId } from 'mongoose';
import { Room } from 'src/schema/room.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room.name)
    private RoomModel: Model<Room>,
    private usersService: UsersService
  ) { }

  async create(data: CreateRoomDto) {
    try {
      let { room_name, user_id, description } = data;
      if (room_name.includes(' ')) throw new UnprocessableEntityException('Room Name cannot contain spaces')

      let is_room_name_non_unique = await this.RoomModel.findOne({
        room_name,
        is_deleted: false
      })
      if (is_room_name_non_unique) throw new UnprocessableEntityException('Room with given name already exists. Please try with some other name');

      let does_user_exists = await this.usersService.isUserActive(user_id);
      if (!does_user_exists) throw new UnprocessableEntityException('User Does not Exists');
      let room = await this.RoomModel.create({
        room_name,
        created_by: user_id,
        description
      })

      return {
        status: 1,
        message: 'Successfully Created Room.',
        resultSet: {
          room_details: {
            room_id: room._id
          }
        }
      }
    } catch (error) {
      if (error instanceof UnprocessableEntityException) throw error;
      console.log('error in creating room', error);
      throw new InternalServerErrorException();
    }
  }

  async findAllRooms(data: FindRoomDto) {
    try {
      let { room_name, page, limit } = data;

      let criteria: any = {
        is_deleted: false
      }

      let skip_entries;
      let limit_entries;
      if (page && limit) {
        limit_entries = limit ? Number(limit) : null;
        skip_entries = page ? ((Number(page) - 1) * limit_entries) : null;
      }

      if (room_name) criteria.room_name = { '$regex': `${room_name}`, '$options': 'i' }

      let total_room_count = await this.RoomModel.count(criteria)
      let users = await this.RoomModel.find(criteria, {
        _id: true,
        room_name: true,
        description: true,
        created_by: true,
      }, {
        skip: skip_entries,
        limit: limit_entries,
        sort: {
          _id: -1
        }
      });
      return {
        status: 1,
        message: 'Successfully fetched Room/s',
        resultSet: {
          users: users,
          pagination_constraints: {
            total_user_count: total_room_count,
            total_pending_count: (total_room_count - (page * limit_entries)) > 0 ? total_room_count - (page * limit_entries) : 0
          }
        }
      }

    } catch (error) {
      if (error instanceof UnprocessableEntityException) throw error;
      console.log('error in finding user account', error);
      throw new InternalServerErrorException();
    }
  }

  async isRoomActive(room_id: string) {
    try {
      let does_room_exists = await this.RoomModel.findOne({
        _id: room_id,
        is_deleted: false
      })
      if (!does_room_exists) return false;
      return does_room_exists;
    } catch (error) {
      console.log('error in checking user is active', error);
      throw new InternalServerErrorException();
    }
  }

}
