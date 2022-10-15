import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as schema } from 'mongoose';
import { Message } from './message.schema';
import { User } from './user.schema';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Chat {
    @Prop({ isRequired: true })
    chat_name: string;

    @Prop({ isRequired: true, default: false })
    is_group_chat: boolean;

    @Prop({ type: [{ type: schema.Types.ObjectId, ref: User }] })
    users: User[];

    @Prop({ type: schema.Types.ObjectId, ref: Message })
    latest_message: Message

}

export const ChatSchema = SchemaFactory.createForClass(Chat);