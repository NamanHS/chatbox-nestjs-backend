import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validateUserDto, LoginUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import 'dotenv/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(data: validateUserDto) {
        try {
            let { username, password } = data;
            let user = await this.userService.validateUser({ username, password });
            return user;
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            if (error instanceof UnauthorizedException) throw error;
            console.log('error in validating user', error);
            throw new InternalServerErrorException();
        }
    }

    async loginUser(data: LoginUserDto) {
        try {
            let { username, id, pic, bio } = data;

            let payload = {
                username,
                id
            }

            return {
                status: 1,
                message: 'Successfully Loged in User',
                resultSet: {
                    id,
                    username,
                    pic,
                    bio,
                    auth_token: this.jwtService.sign(payload, { secret: process.env.AUTH_SECRET_KEY })
                }
            }
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            if (error instanceof UnauthorizedException) throw error;
            console.log('error in validating user', error);
            throw new InternalServerErrorException();
        }
    }
}
