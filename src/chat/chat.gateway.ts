import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateMessageInChatRoomtDto, JoinChatRoomDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer()
  private wss: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit(server: any) {
    console.log('Chat WS Gateway Initiated Successfully...')
  }

  handleConnection(client: Socket) {
    console.log('Client connected to Chat WS Gateway...');
    // this.ws_server.emit('message', 'hello world');
  }

  handleDisconnect(client: Socket) {
    console.log('Client terminated connecion from Chat WS Gateway...');
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, room_id) {
    let response = await this.chatService.joinRoom(room_id);
    await client.join(response.room.id)
    client.emit('room_ack', response)
  }

  @SubscribeMessage('createMessageInRoom')
  async create(@MessageBody() data: CreateMessageInChatRoomtDto) {
    let response = await this.chatService.createMessageInChatRoom(data);
    this.wss.to(response.room.id).emit('new_message', response)
  }


}
