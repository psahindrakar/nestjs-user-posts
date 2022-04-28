import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { User } from './user.model';

@WebSocketGateway()
export class UserGateway {
  private readonly logger = new Logger(UserGateway.name);

  @WebSocketServer() private server: Server;

  sendUserCreatedEvent(createdUser: User) {
    this.logger.debug(
      'Sending user created event: ',
      JSON.stringify(createdUser),
    );
    this.server.emit('USER_CREATED', createdUser);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.logger.debug('Received message: ', message);
    this.server.emit('message', message);
  }
}
