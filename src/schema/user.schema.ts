import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
    @Prop({ isRequired: true })
    username: string;

    @Prop({ isRequired: true })
    password: string;

    @Prop({ isRequired: false, default: 'Hey there! I am using Chatbox' })
    bio: string;

    @Prop({ isRequired: false, default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' })
    pic: string;

    @Prop({ isRequired: false, default: false })
    is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);