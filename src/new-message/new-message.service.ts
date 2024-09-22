import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { NewMessage } from './entities/new-message.entity';
import { SocketGateway } from 'socket.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NewMessageService {
  // constructor(
  //   @InjectModel(NewMessage.name)
  //   private readonly newMessageRepository: Model<NewMessage>,
  // ) {}
  // async createNewMessage(
  //   identifierUserChat: string,
  //   user: User,
  // ): Promise<NewMessage> {
  //   const newMessage: NewMessage = this.newMessageRepository.create({
  //     identifierUserChat,
  //     userId: user.id,
  //   });
  //   if (!newMessage) {
  //     throw new BadRequestException('Có lỗi xảy ra khi tạo tin nhắn mới');
  //   }
  //   try {
  //     const result: NewMessage =
  //       await this.newMessageRepository.save(newMessage);
  //     if (!result) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi lưu thông tin tin nhắn mới',
  //       );
  //     }
  //     await this.handleGetAllNewMessage(identifierUserChat);
  //     return result;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
  // async getAllNewMessage(identifierUserChat: string): Promise<NewMessage[]> {
  //   try {
  //     const newMessages: NewMessage[] = await this.newMessageRepository.find({
  //       where: {
  //         identifierUserChat,
  //       },
  //     });
  //     if (!newMessages) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi truy xuất tất cả tin nhắn mới',
  //       );
  //     }
  //     await this.handleGetAllNewMessage(identifierUserChat);
  //     return newMessages;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async updateAllNewMessage(
  //   identifierUserChat: string,
  //   user: User,
  // ): Promise<NewMessage[]> {
  //   const newMessages: NewMessage[] =
  //     await this.getAllNewMessage(identifierUserChat);
  //   if (newMessages.length === 0) {
  //     throw new BadRequestException(
  //       'Hệ thống không tồn tại bất kì tin nhắn mới',
  //     );
  //   }
  //   newMessages.forEach((message) => {
  //     if (message.userId != user.id) {
  //       message.isNew = true;
  //     } else {
  //       message.isNew = false;
  //     }
  //   });
  //   try {
  //     const result: NewMessage[] =
  //       await this.newMessageRepository.save(newMessages);
  //     if (!result) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi cập nhật tất cả tin nhắn mới',
  //       );
  //     }
  //     await this.handleGetAllNewMessage(identifierUserChat);
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async updateNewMessage(
  //   identifierUserChat: string,
  //   user: User,
  // ): Promise<NewMessage> {
  //   const newMessage: NewMessage = await this.newMessageRepository.findOne({
  //     where: {
  //       identifierUserChat,
  //       userId: user.id,
  //     },
  //   });
  //   if (!newMessage) {
  //     throw new BadRequestException('Không tồn tại tin nhắn mới');
  //   }
  //   newMessage.isNew = false;
  //   try {
  //     const result: NewMessage =
  //       await this.newMessageRepository.save(newMessage);
  //     if (!result) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi cập nhật tin nhắn mới',
  //       );
  //     }
  //     SocketGateway.handleGetNewMessage({
  //       newMessage: newMessage,
  //       userEmail: user.email,
  //     });
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async handleGetAllNewMessage(identifierUserChat: string): Promise<void> {
  //   try {
  //     const newMessages: NewMessage[] = await this.newMessageRepository.find({
  //       where: {
  //         identifierUserChat,
  //       },
  //     });
  //     if (!newMessages) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi truy xuất tất cả tin nhắn mới',
  //       );
  //     }
  //     SocketGateway.handleGetAllNewMessage({
  //       newMessages: newMessages,
  //       identifierUserChat: identifierUserChat,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
