import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors, Request, Delete, Patch, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGaurd } from 'src/auth/local-auth.guard';
import { DeleteUserDto, FindUserDto, RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @UseGuards(LocalAuthGaurd)
    @Post('login')
    @HttpCode(200)
    async login(@Request() req) {
        return this.authService.loginUser(req.user)
    }

    @Post('/register')
    @HttpCode(200)
    @UseInterceptors(
        FileInterceptor("pic", {
            dest: './profile_picture'
        })
    )
    async registerUser(@UploadedFile() pic, @Body() data: RegisterUserDto) {
        if (pic) {
            let allowed_mime_type = ['image/jpe', 'image/jpg', 'image/jpeg', 'image/png', 'image/tiff'] //image
            let mime_type = pic.mimetype;
            if (!(allowed_mime_type.includes(mime_type))) throw new UnprocessableEntityException('Document type not supported');
        }
        return this.userService.registerUser(data, pic)
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(LocalAuthGaurd)
    @Delete('delete')
    async deleteUser(@Body() data: DeleteUserDto) {
        return this.userService.deleteUserAccount(data)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update')
    @HttpCode(200)
    @UseInterceptors(
        FileInterceptor("pic", {
            dest: './profile_picture'
        })
    )
    async updateUser(@UploadedFile() pic, @Body() data: UpdateUserDto) {
        if (pic) {
            let allowed_mime_type = ['image/jpe', 'image/jpg', 'image/jpeg', 'image/png', 'image/tiff'] //image
            let mime_type = pic.mimetype;
            if (!(allowed_mime_type.includes(mime_type))) throw new UnprocessableEntityException('Document type not supported');
        }
        return this.userService.updateUser(data, pic)
    }

    @UseGuards(JwtAuthGuard)
    @Get('find')
    async findUsers(@Query() data: FindUserDto) {
        return this.userService.findUsers(data)
    }

}
