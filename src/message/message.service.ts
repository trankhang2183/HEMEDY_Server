import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { SocketGateway } from 'socket.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  // constructor(
  //   @InjectModel(Message.name)
  //   private readonly messageRepository: Model<Message>,
  // ) {}
  // async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
  //   // const group: Group = await this.groupService.getGroupByGroupId(
  //   //   createMessageDto.groupId,
  //   // );
  //   // if (group.group_status == GroupStatusEnum.INACTIVE) {
  //   //   throw new BadRequestException('Nhóm đã ngừng hoạt động');
  //   // }
  //   const message: Message = this.messageRepository.create(createMessageDto);
  //   if (!message) {
  //     throw new BadRequestException('Có lỗi xảy ra khi tạo tin nhắn mới');
  //   }
  //   try {
  //     const result: Message = await this.messageRepository.save(message);
  //     if (!result) {
  //       throw new BadRequestException(
  //         'Có lỗi xảy ra khi lưu thông tin tin nhắn mới',
  //       );
  //     }
  //     await this.handleGetAllMessage(createMessageDto.identifierUserChat);
  //     return result;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
  // async getAllMessages(identifierUserChat: string): Promise<Message[]> {
  //   try {
  //     const messages: Message[] = await this.messageRepository.find({
  //       where: { identifierUserChat },
  //     });
  //     if (!messages) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi truy xuất tất cả tin nhắn',
  //       );
  //     }
  //     await this.handleGetAllMessage(identifierUserChat);
  //     return messages;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // async handleGetAllMessage(identifierUserChat: string): Promise<void> {
  //   try {
  //     const messages: Message[] = await this.messageRepository.find({
  //       where: { identifierUserChat },
  //     });
  //     if (!messages) {
  //       throw new InternalServerErrorException(
  //         'Có lỗi xảy ra khi truy xuất tất cả tin nhắn',
  //       );
  //     }
  //     SocketGateway.handleGetAllMessage({
  //       messages: messages,
  //       identifierUserChat: identifierUserChat,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
