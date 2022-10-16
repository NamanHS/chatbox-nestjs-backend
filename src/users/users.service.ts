import { Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { DeleteUserDto, FindUserDto, RegisterUserDto, UpdateUserDto, validateUserDto } from './dto/user.dto';
import { comparePassword, encodePassword } from 'src/utils/encryptor';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>
    ) { }

    async validateUser(data: validateUserDto) {
        try {
            let { username, password } = data;
            let user = await this.UserModel.findOne({
                username,
                is_deleted: false
            })

            if (!user) throw new UnprocessableEntityException('You do not have account registered yet. Please create a account');

            let is_user_password_matched = await comparePassword(user.password, password)
            if (!is_user_password_matched) throw new UnauthorizedException('Invalid Credentials');
            if (user) return { id: user._id.toString(), username: user.username, pic: user.pic, bio: user.bio }
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            if (error instanceof UnauthorizedException) throw error;
            console.log('error in validating user', error);
            throw new InternalServerErrorException();
        }
    }

    async registerUser(data: RegisterUserDto, pic) {
        try {
            let { username, password } = data;
            if (username.includes(' ')) throw new UnprocessableEntityException('Username cannot contain spaces')

            let is_username_non_unique = await this.UserModel.findOne({
                username,
                is_deleted: false
            })
            if (is_username_non_unique) throw new UnprocessableEntityException('Username already exists. Please try with some other name');

            password = await encodePassword(password)

            if (pic) {
                //TODO: UPLOAD IN S3 and Save S3 Object link against user pic 
            }

            await this.UserModel.create({
                username,
                password
            })

            return {
                status: 1,
                message: 'Successfully Registered User. Please Log In to use the App',
                resultSet: {}
            }
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            console.log('error in validating user', error);
            throw new InternalServerErrorException();
        }
    }

    async deleteUserAccount(data: DeleteUserDto) {
        try {
            let { username } = data;
            let does_user_exists = await this.UserModel.findOne({
                username,
                is_deleted: false
            })
            if (!does_user_exists) throw new UnprocessableEntityException('User Account does not exists to delete');

            await this.UserModel.updateOne({
                _id: does_user_exists._id
            }, {
                is_deleted: true
            })

            return {
                status: 1,
                message: 'Successfully Deleted User',
                resultSet: {}
            }
        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            console.log('error in deleting user account', error);
            throw new InternalServerErrorException();
        }
    }

    async updateUser(data: UpdateUserDto, pic) {
        try {
            let { id, bio } = data;
            let does_user_exists = await this.UserModel.findOne({
                _id: id,
                is_deleted: false
            })
            if (!does_user_exists) throw new UnprocessableEntityException('User Account does not exists to update');

            if (pic) {
                //TODO: UPLOAD IN S3 and Save S3 Object link against user pic and unsink from local disk storage.
            }

            await this.UserModel.updateOne({
                _id: does_user_exists._id
            }, {
                bio
            })

            return {
                status: 1,
                message: 'Successfully Updated User',
                resultSet: {}
            }

        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            console.log('error in updating user account', error);
            throw new InternalServerErrorException();
        }
    }

    async findUsers(data: FindUserDto) {
        try {
            let { username, page, limit } = data;

            let criteria: any = {
                is_deleted: false
            }

            let skip_entries;
            let limit_entries;
            if (page && limit) {
                limit_entries = limit ? Number(limit) : null;
                skip_entries = page ? ((Number(page) - 1) * limit_entries) : null;
            }

            if (username) criteria.username = { '$regex': `${username}`, '$options': 'i' }

            let total_user_count = await this.UserModel.count(criteria)
            let users = await this.UserModel.find(criteria, {
                _id: true,
                username: true,
                bio: true,
                pic: true
            }, {
                skip: skip_entries,
                limit: limit_entries,
                sort: {
                    _id: -1
                }
            });
            return {
                status: 1,
                message: 'Successfully fetched User/s',
                resultSet: {
                    users: users,
                    pagination_constraints: {
                        total_user_count,
                        total_pending_count: (total_user_count - (page * limit_entries)) > 0 ? total_user_count - (page * limit_entries) : 0
                    }
                }
            }

        } catch (error) {
            if (error instanceof UnprocessableEntityException) throw error;
            console.log('error in finding user account', error);
            throw new InternalServerErrorException();
        }
    }

    async isUserActive(user_id: string) {
        try {
            let does_user_exists = await this.UserModel.findOne({
                _id: user_id,
                is_deleted: false
            })
            if (!does_user_exists) return false;
            return does_user_exists;
        } catch (error) {
            console.log('error in checking user is active', error);
            throw new InternalServerErrorException();
        }
    }
}
