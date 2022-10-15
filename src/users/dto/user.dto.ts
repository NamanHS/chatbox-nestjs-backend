import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class validateUserDto {
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    pic: string

    @IsNotEmpty()
    bio: string
}

export class RegisterUserDto {

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @MinLength(8)
    password: string
}

export class DeleteUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}

export class UpdateUserDto {
    @IsNotEmpty()
    id: string

    @IsOptional()
    bio: string
}

export class FindUserDto {
    @IsOptional()
    username: string

    @IsOptional()
    readonly page: number;

    @IsOptional()
    readonly limit: number;
}