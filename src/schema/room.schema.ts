import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as schema, Types } from 'mongoose';
import { User } from './user.schema';

export type RoomDocument = Room & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Room {
    @Prop({ isRequired: true })
    room_name: string;

    @Prop({ isRequired: true })
    description: string;

    @Prop({ type: schema.Types.ObjectId, ref: 'User' })
    created_by: Types.ObjectId;

    @Prop({ isRequired: false, default: false })
    is_deleted: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);