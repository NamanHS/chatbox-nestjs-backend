import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModuleOptions } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthModuleOptions],
  exports: [UsersService]
})
export class UsersModule { }
