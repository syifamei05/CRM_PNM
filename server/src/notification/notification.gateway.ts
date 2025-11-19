import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationGateway } from './interface/notification-gateway.interface';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, INotificationGateway
{
  @WebSocketServer()
  server: Server;
  private readonly userSockets = new Map<number, Socket[]>();

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, sockets] of this.userSockets.entries()) {
      const index = sockets.indexOf(client);
      if (index > -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
  }

  registerUserSocket(userId: number, client: Socket) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.push(client);
    }
    this.logger.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('getUserNotifications')
  async handleGetUserNotifications(
    client: Socket,
    data: { user_id: number; options?: any },
  ) {
    try {
      const { notifications, total } =
        await this.notificationService.findAllForUser(
          data.user_id,
          data.options,
        );
      client.emit('userNotifications', { notifications, total });
    } catch (error) {
      this.logger.error('Failed to get user notifications', error);
      client.emit('error', { message: 'Failed to get notifications' });
    }
  }

  sendNotificationToUser(userId: number, notification: Notification) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets && userSockets.length > 0) {
      userSockets.forEach((socket) => {
        socket.emit('notification', notification);
      });
      this.logger.log(
        `📩 Sent notification to user ${userId} (${userSockets.length} sockets)`,
      );
    } else {
      this.logger.log(`📩 No active sockets for user ${userId}`);
    }
  }

  sendNotificationToAll(notification: Notification) {
    this.server.emit('notification', notification);
    this.logger.log('📢 Broadcast notification to all connected clients');
  }

  // Tambahkan event untuk user authentication
  @SubscribeMessage('authenticate')
  handleAuthenticate(client: Socket, userId: number) {
    this.registerUserSocket(userId, client);
    client.emit('authenticated', { success: true });
    this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
  }

  @SubscribeMessage('createNotification')
  async handleCreateNotification(client: Socket, data: CreateNotificationDto) {
    try {
      const notification = await this.notificationService.create(data);
      client.emit('notificationCreated', notification);
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      client.emit('error', { message: 'Failed to create notification' });
    }
  }

  @SubscribeMessage('updateNotification')
  async handleUpdateNotification(
    client: Socket,
    data: { notification_id: number; updates: UpdateNotificationDto },
  ) {
    try {
      const updated = await this.notificationService.update(
        data.notification_id,
        data.updates,
      );
      client.emit('notificationUpdated', updated);
    } catch (error) {
      this.logger.error('Failed to update notification', error);
      client.emit('error', { message: 'Failed to update notification' });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, notification_id: number) {
    try {
      const updated =
        await this.notificationService.markAsRead(notification_id);
      client.emit('notificationMarkedRead', updated);
    } catch (error) {
      this.logger.error('Failed to mark notification as read', error);
      client.emit('error', { message: 'Failed to mark as read' });
    }
  }

  @SubscribeMessage('markAllAsRead')
  async handleMarkAllAsRead(client: Socket, user_id: number) {
    try {
      await this.notificationService.markAllAsRead(user_id);
      client.emit('allNotificationsMarkedRead', { success: true });
    } catch (error) {
      this.logger.error('Failed to mark all as read', error);
      client.emit('error', { message: 'Failed to mark all as read' });
    }
  }
}
