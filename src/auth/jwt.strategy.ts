import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'

import { validateUserDto } from "src/users/dto/user.dto";
import { AuthService } from "./auth.service";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `${process.env.AUTH_SECRET_KEY}`
        });
    }

    async validate(payload: any) {
        try {
            return {
                id: payload.sub,
                username: payload.username
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            console.log('error in validating JWT AUTH TOKEN', error);
            throw new InternalServerErrorException();
        }
    }
}