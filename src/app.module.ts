import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config'
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { RoomsModule } from './rooms/rooms.module';


@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGODB_URL}`), UsersModule, AuthModule, JwtModule, ChatModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule { }
