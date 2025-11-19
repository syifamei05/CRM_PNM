import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { INotificationGateway } from './interface/notification-gateway.interface';
import { NotificationGateway } from './notification.gateway';
export interface FindByUserOptions {
  unreadOnly?: boolean;
  limit?: number;
  page?: number;
}

export interface FindBroadcastOptions {
  unreadOnly?: boolean;
  limit?: number;
  page?: number;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @Inject(forwardRef(() => NotificationGateway))
    private readonly gateway: INotificationGateway,
  ) {}

  async findAll(): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Failed to find all notifications', error);
      throw new InternalServerErrorException(
        'Failed to retrieve notifications',
      );
    }
  }

  async findOne(notification_id: number): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { notification_id },
      });
      if (!notification)
        throw new NotFoundException(
          `Notification ${notification_id} not found`,
        );
      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Failed to find notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to retrieve notification');
    }
  }

  async notifyUserStatusChange(
    userId: number,
    userName: string,
    status: 'online' | 'offline',
  ): Promise<Notification> {
    try {
      const notification = await this.create({
        // ❗ JANGAN kirim userId untuk broadcast notification
        type: NotificationType.SYSTEM,
        title: `User Status Update`,
        message: `${userName} is now ${status}`,
        category: 'user-status',
        metadata: { userId, userName, status, timestamp: new Date() },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // Notifikasi sudah otomatis dikirim via create() method
      this.logger.log(
        `User status notification created for ${userName} (${status})`,
      );

      return notification;
    } catch (error) {
      this.logger.error('Failed to create user status notification', error);
      throw new InternalServerErrorException(
        'Failed to create status notification',
      );
    }
  }

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = this.notificationRepository.create({
        ...createDto,
        user_id: createDto.userId ? Number(createDto.userId) : null,
        expires_at: createDto.expiresAt ?? null,
      });

      const savedNotification =
        await this.notificationRepository.save(notification);

      if (savedNotification.user_id) {
        this.gateway.sendNotificationToUser(
          savedNotification.user_id,
          savedNotification,
        );
      } else {
        this.gateway.sendNotificationToAll(savedNotification);
      }

      this.logger.log(
        savedNotification.user_id
          ? `Notification created for user ${savedNotification.user_id}`
          : `Broadcast notification created`,
      );
      return savedNotification;
    } catch (error) {
      this.logger.error('Failed to create notification', error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async update(
    notification_id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.findOne(notification_id);
      Object.assign(notification, updateNotificationDto);
      const updated = await this.notificationRepository.save(notification);

      if (updated.user_id) {
        this.gateway.sendNotificationToUser(updated.user_id, updated);
      } else {
        this.gateway.sendNotificationToAll(updated);
      }

      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  async markAllAsRead(user_id: number): Promise<void> {
    try {
      await this.notificationRepository
        .createQueryBuilder()
        .update(Notification)
        .set({ read: true })
        .where('user_id = :user_id', { user_id })
        .andWhere('read = false')
        .execute();

      this.logger.log(`All notifications marked as read for user ${user_id}`);
    } catch (error) {
      this.logger.error(
        `Failed to mark all as read for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to mark notifications as read',
      );
    }
  }

  // BARUUUU
  // -----------------------------------------------------------------------------

  async findBroadcastNotifications(
    options: FindBroadcastOptions = {},
  ): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const { unreadOnly = false, limit = 50, page = 1 } = options;

      const query = this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user_id IS NULL')
        .orderBy('notification.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (unreadOnly) {
        query.andWhere('notification.read = false');
      }

      const [notifications, total] = await query.getManyAndCount();

      this.logger.log(`Found ${notifications.length} broadcast notifications`);
      return { notifications, total };
    } catch (error) {
      this.logger.error('Failed to find broadcast notifications', error);
      throw new InternalServerErrorException(
        'Failed to retrieve broadcast notifications',
      );
    }
  }

  async findAllForUser(
    user_id: number,
    options: FindByUserOptions = {},
  ): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const { unreadOnly = false, limit = 50, page = 1 } = options;

      const query = this.notificationRepository
        .createQueryBuilder('notification')
        .where(
          '(notification.user_id = :user_id OR notification.user_id IS NULL)',
          { user_id },
        )
        .orderBy('notification.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (unreadOnly) {
        query.andWhere('notification.read = false');
      }

      const [notifications, total] = await query.getManyAndCount();

      this.logger.log(
        `Found ${notifications.length} notifications for user ${user_id}`,
      );
      return { notifications, total };
    } catch (error) {
      this.logger.error(
        `Failed to find all notifications for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve user notifications',
      );
    }
  }

  // -----------------------------------------------------------------------------

  async markAsRead(notification_id: number): Promise<Notification> {
    try {
      const notification = await this.findOne(notification_id);
      notification.read = true;
      const updated = await this.notificationRepository.save(notification);

      if (updated.user_id) {
        this.gateway.sendNotificationToUser(updated.user_id, updated);
      } else {
        this.gateway.sendNotificationToAll(updated);
      }

      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to mark notification ${notification_id} as read`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to mark notification as read',
      );
    }
  }

  async getUnreadCount(user_id: number): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: { user_id, read: false },
      });
    } catch (error) {
      this.logger.error(
        `Failed to get unread count for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to get unread count');
    }
  }

  async remove(notification_id: number): Promise<void> {
    try {
      const result = await this.notificationRepository.delete(notification_id);
      if (result.affected === 0)
        throw new NotFoundException(
          `Notification ${notification_id} not found`,
        );
      this.logger.log(`Notification ${notification_id} deleted`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Failed to delete notification ${notification_id}`,
        error,
      );
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }

  async removeExpired(): Promise<void> {
    try {
      const result = await this.notificationRepository
        .createQueryBuilder()
        .delete()
        .where('expires_at < :now', { now: new Date() })
        .execute();

      this.logger.log(`Removed ${result.affected ?? 0} expired notifications`);
    } catch (error) {
      this.logger.error('gagal memindahkan notifikasi expired', error);
      throw new InternalServerErrorException(
        'gagal memindahkan notifikasi expired',
      );
    }
  }

  async createMultiple(
    createDtos: CreateNotificationDto[],
  ): Promise<Notification[]> {
    try {
      const notificationsData = createDtos.map((dto) => ({
        ...dto,
        user_id: dto.userId ? Number(dto.userId) : null,
        expires_at: dto.expiresAt ?? null,
      }));

      const notifications =
        this.notificationRepository.create(notificationsData);
      const savedNotifications =
        await this.notificationRepository.save(notifications);

      this.logger.log(`Created ${savedNotifications.length} notifications`);
      return savedNotifications;
    } catch (error) {
      this.logger.error('gagal buat notifikasi', error);
      throw new InternalServerErrorException('gagal buat notifikasi');
    }
  }

  async findByUser(
    user_id: number,
    options: FindByUserOptions = {},
  ): Promise<{ notifications: Notification[]; total: number }> {
    try {
      const { unreadOnly = false, limit = 50, page = 1 } = options;

      const query = this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user_id = :user_id', { user_id })
        .orderBy('notification.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (unreadOnly) query.andWhere('notification.read = false');

      const [notifications, total] = await query.getManyAndCount();
      return { notifications, total };
    } catch (error) {
      this.logger.error(`gagal menemukan user id ${user_id}`, error);
      throw new InternalServerErrorException(
        'Failed to retrieve user notifications',
      );
    }
  }

  async getRecentUserNotifications(
    user_id: number,
    hours = 24,
  ): Promise<Notification[]> {
    try {
      const since = new Date();
      since.setHours(since.getHours() - hours);

      return await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user_id = :user_id', { user_id })
        .andWhere('notification.created_at > :since', { since })
        .orderBy('notification.created_at', 'DESC')
        .getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get recent notifications for user ${user_id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve recent notifications',
      );
    }
  }
}
