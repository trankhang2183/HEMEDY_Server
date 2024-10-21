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
  @WebSocketServer()
  private readonly server: Server;

  private static instance: SocketGateway;

  afterInit() {
    SocketGateway.instance = this;
  }

  private emitToServer(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    } else {
      console.error('Socket server is not initialized!');
    }
  }

  @SubscribeMessage('getNotifications')
  handleGetNotifications(data: any) {
    this.emitToServer(`getNotifications-${data.receiverEmail}`, data);
  }

  static sendNotification(data: any) {
    if (SocketGateway.instance) {
      SocketGateway.instance.emitToServer(
        `getNotifications-${data.receiverEmail}`,
        data.notification,
      );
    } else {
      console.error('SocketGateway instance is not initialized!');
    }
  }
}
