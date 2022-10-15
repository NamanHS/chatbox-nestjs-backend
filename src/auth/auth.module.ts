import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
dotenv.config();

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule, JwtModule.register({
        secret: `${process.env.AUTH_SECRET_KEY}`,
        signOptions: {
            expiresIn: '60d'
        }
    })],
    providers: [AuthService, LocalStrategy, UsersService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {
}
