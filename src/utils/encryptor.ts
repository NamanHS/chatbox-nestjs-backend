import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();


const SALT = Number(process.env.SALT)

export async function encodePassword(raw_password) {
    try {
        return bcrypt.hashSync(raw_password, SALT)
    } catch (error) {
        console.log('error in hashing password', error);
        throw new InternalServerErrorException();
    }
}

export async function comparePassword(encrypted_password, raw_password) {
    try {
        return bcrypt.compareSync(raw_password, encrypted_password);
    } catch (error) {
        console.log('error in hashing password', error);
        throw new InternalServerErrorException();
    }
}
