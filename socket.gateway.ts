import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit {
  private static server: Server;

  @WebSocketServer() serverInstance: Server;

  afterInit(server: Server) {
    SocketGateway.setServerInstance(server);
  }

  static setServerInstance(server: Server) {
    SocketGateway.server = server;
  }

  private static emitToServer(event: string, data: any) {
    if (SocketGateway.server) {
      SocketGateway.server.emit(event, data);
    } else {
      console.error('Socket server is not initialized!');
    }
  }

  @SubscribeMessage('getNotifications')
  static handleGetNotifications(data: any) {
    SocketGateway.emitToServer(`getNotifications-${data.receiverEmail}`, data);
  }

  @SubscribeMessage('getAllMessage')
  static handleGetAllMessage(data: any) {
    SocketGateway.emitToServer(
      `getAllMessage-${data.identifierUserChat}`,
      data,
    );
  }

  @SubscribeMessage('getNewMessage')
  static handleGetNewMessage(data: any) {
    SocketGateway.emitToServer(`getNewMessage-${data.userEmail}`, data);
  }

  @SubscribeMessage('getAllNewMessage')
  static handleGetAllNewMessage(data: any) {
    SocketGateway.emitToServer(
      `getAllNewMessage-${data.identifierUserChat}`,
      data,
    );
  }
}
