import { Notification } from '../entities/notification.entity';
import { Server } from 'socket.io';
export interface INotificationGateway {
  server: Server;
  sendNotificationToUser(
    userId: number | null,
    notification: Notification,
  ): void;
  sendNotificationToAll(notification: Notification): void;
}
