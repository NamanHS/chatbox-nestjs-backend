import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { validateUserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super();
    }

    async validate(username, password) {
        try {
            let user = this.authService.validateUser({ username, password });
            return user;
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            if (error instanceof UnauthorizedException) throw error;
            console.log('error in validating user', error);
            throw new InternalServerErrorException();
        }
    }
}