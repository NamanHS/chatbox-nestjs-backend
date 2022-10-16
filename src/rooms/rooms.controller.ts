import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, FindRoomDto } from './dto/room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() data: CreateRoomDto) {
    return this.roomsService.create(data);
  }

  @Get()
  async findAllRooms(@Query() data: FindRoomDto) {
    return this.roomsService.findAllRooms(data);
  }

}
