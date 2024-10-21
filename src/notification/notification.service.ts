import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './entities/notification.entity';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { SocketGateway } from 'socket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationRepository: Model<Notification>,

    private readonly userService: UserService,
  ) {}
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const receiver: User = await this.userService.getUserByEmail(
      createNotificationDto.receiver_email,
    );
    if (!receiver.status) {
      throw new BadGatewayException('Tài khoản nhận thông báo không hoạt động');
    }
    const notification = await this.notificationRepository.create(
      createNotificationDto,
    );
    if (!notification) {
      throw new BadGatewayException('Có lỗi xảy ra khi tạo thông báo mới');
    }
    notification.receiver_id = receiver;
    try {
      const result: Notification = await notification.save();
      if (!result) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra khi lưu thông báo mới',
        );
      }
      await this.handleGetNotifications(receiver, notification);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllNotificationOfReceiver(user: any): Promise<any> {
    try {
      const receiverId: number = user._id;
      const notifications: Notification[] = await this.notificationRepository
        .find({
          receiver: receiverId,
        })
        .sort({ createdAt: -1 });
      const total_notifications: number = notifications.filter(
        (notification) => notification.is_new,
      ).length;
      return [total_notifications, notifications];
    } catch (error) {
      throw new InternalServerErrorException(
        'Có lỗi khi truy xuất tất cả thông báo của người nhận',
      );
    }
  }

  async getNotificationById(id: number): Promise<Notification> {
    try {
      const notification: Notification = await this.notificationRepository
        .findOne({
          _id: id,
        })
        .populate('receiver');
      if (!notification) {
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      return notification;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateNotificationOfReceiver(
    id: number,
    user: any,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      _id: id,
      receiver_id: user._id,
    });
    if (notification) {
      throw new BadGatewayException(
        'Không thể đánh dấu đã đọc thông báo của thông báo người khác',
      );
    }
    try {
      notification.is_new = false;
      const result = await notification.save();
      if (!result) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra khi đánh dấu người nhận đã đọc thông báo',
        );
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateAllNotificationOfReceiver(user: any): Promise<Notification[]> {
    const notifications_response =
      await this.getAllNotificationOfReceiver(user);
    if (notifications_response[0] == 0) {
      throw new NotFoundException('Người dùng không có thông báo');
    }
    const notifications = notifications_response[1];
    notifications.forEach(
      (notification: { is_new: boolean }) => (notification.is_new = false),
    );
    try {
      const result: Notification[] = await notifications.save();
      if (!result || result.length === 0) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra khi đánh dấu người nhận đã đọc tất cả thông báo',
        );
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async handleGetNotifications(
    user: any,
    notification: Notification,
  ): Promise<void> {
    try {
      SocketGateway.sendNotification({
        notification,
        receiverEmail: user.email,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Có lỗi khi truy xuất tất cả thông báo của người nhận',
      );
    }
  }
}
