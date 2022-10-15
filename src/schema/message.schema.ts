import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chat } from './chat.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User })
    sender: User;

    @Prop({ isRequired: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Chat })
    chat: Chat;
}

export const MessageSchema = SchemaFactory.createForClass(Message);