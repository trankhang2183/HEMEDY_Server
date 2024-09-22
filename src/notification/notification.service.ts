import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { SocketGateway } from 'socket.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  // constructor(
  //   @InjectModel(Notification.name)
  //   private readonly notificationModel: Model<Notification>,
  //   private readonly userService: UserService,
  // ) {}
  // async createNotification(
  //   createNotificationDto: CreateNotificationDto,
  // ): Promise<Notification> {
  //   const sender: User = await this.userService.getUserByEmail(
  //     createNotificationDto.sender_email,
  //   );
  //   if (!sender.status) {
  //     throw new BadGatewayException('Tài khoản gửi thông báo không hoạt động');
  //   }
  //   const receiver: User = await this.userService.getUserByEmail(
  //     createNotificationDto.receiver_email,
  //   );
  //   if (!receiver.status) {
  //     throw new BadGatewayException('Tài khoản nhận thông báo không hoạt động');
  //   }
  //   // Tạo đối tượng Notification mới
  //   const notification = new this.notificationModel({
  //     ...createNotificationDto,
  //     // sender: sender._id,
  //     // receiver: receiver._id,
  //   });
  //   if (!notification) {
  //     throw new BadGatewayException('Có lỗi xảy ra khi tạo thông báo mới');
  //   }
  //   try {
  //     const result = await notification.save();
  //     // Kiểm tra nếu việc lưu thất bại
  //     if (!result) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi lưu thông báo mới',
  //       );
  //     }
  //     // Gọi hàm xử lý để gửi thông báo tới người nhận
  //     await this.handleGetNotifications(receiver);
  //     return result; // Trả về thông báo đã lưu
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async getAllNotificationOfReceiver(
  //   user: User,
  // ): Promise<[total_notifications: number, Notification[]]> {
  //   try {
  //     const receiverId = user._id;
  //     const notifications: Notification[] = await this.notificationModel
  //       .find({ receiver: receiverId })
  //       .populate('sender')
  //       .populate('receiver')
  //       .exec();
  //     const total_notifications: number = notifications.filter(
  //       (notification) => notification.is_new,
  //     ).length;
  //     notifications.sort();
  //     await this.handleGetNotifications(user);
  //     return [total_notifications, notifications];
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Có lỗi khi truy xuất tất cả thông báo của người nhận',
  //     );
  //   }
  // }
  // async getNotificationById(id: number): Promise<Notification> {
  //   try {
  //     const notification: Notification = await this.notificationModel.findOne({
  //       where: { id },
  //       relations: ['sender', 'receiver'],
  //     });
  //     if (!notification) {
  //       throw new NotFoundException('Không tìm thấy thông báo');
  //     }
  //     return notification;
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }
  // async updateNotificationOfReceiver(
  //   id: number,
  //   user: User,
  // ): Promise<Notification> {
  //   const notification: Notification = await this.getNotificationById(id);
  //   if (notification.receiver.id != user.id) {
  //     throw new BadGatewayException(
  //       'Không thể đánh dấu đã đọc thông báo của thông báo người khác',
  //     );
  //   }
  //   try {
  //     notification.is_new = false;
  //     const result: Notification =
  //       await this.notificationModel.save(notification);
  //     if (!result) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi đánh dấu người nhận đã đọc thông báo',
  //       );
  //     }
  //     await this.handleGetNotifications(user);
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async updateAllNotificationOfReceiver(user: User): Promise<Notification[]> {
  //   const notifications_response: [number, Notification[]] =
  //     await this.getAllNotificationOfReceiver(user);
  //   if (notifications_response[0] === 0) {
  //     throw new NotFoundException('Người dùng không có thông báo');
  //   }
  //   const notifications: Notification[] = notifications_response[1];
  //   notifications.forEach((notification) => (notification.is_new = false));
  //   try {
  //     const updatedNotifications: Notification[] = [];
  //     for (const notification of notifications) {
  //       const updatedNotification =
  //         await this.notificationModel.findByIdAndUpdate(
  //           notification,
  //           { is_new: false },
  //           { new: true },
  //         );
  //       updatedNotifications.push(updatedNotification);
  //     }
  //     if (updatedNotifications.length === 0) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi đánh dấu người nhận đã đọc tất cả thông báo',
  //       );
  //     }
  //     await this.handleGetNotifications(user);
  //     return updatedNotifications;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async handleGetNotifications(user: User): Promise<void> {
  //   try {
  //     // const receiverId = user._id;
  //     const notifications: Notification[] = await this.notificationModel
  //       // .find({ receiver: receiverId })
  //       .find()
  //       .populate('receiver')
  //       .populate('sender')
  //       .exec();
  //     const total_notifications: number = notifications.filter(
  //       (notification) => notification.is_new,
  //     ).length;
  //     // notifications.sort(
  //     //   (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  //     // );
  //     SocketGateway.handleGetNotifications({
  //       total_notifications: total_notifications,
  //       notifications: notifications,
  //       receiverEmail: user.email,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Có lỗi khi truy xuất tất cả thông báo của người nhận',
  //     );
  //   }
  // }
}
