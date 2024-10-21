import { PayProductAccountBalanceTransactionDto } from './dto/pay-product-account-balance-transaction.dto';
import { PayProductTransactionDto } from './dto/pay-product-transaction.dto';
import { AddFundTransactionDto } from './dto/add-funds-transaction.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { Request } from 'express';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { Transaction } from './entities/transaction.entity';
import { PaymentTypeEnum } from './enum/paymen-type.enum';
import { TransactionStatusEnum } from './enum/transaction-status.enum';
import { TransactionTypeEnum } from './enum/transaction-type.enum';
import Stripe from 'stripe';
import { PayProductStripeTransactionDto } from './dto/pay-product-stripe-transaction.dto';
import {
  ScheduleSlotEnum,
  TimeOfSlotInSchedule,
} from 'src/doctor-schedule/enum/schedule-slot.enum';
import {
  DoctorSchedule,
  DoctorScheduleDocument,
} from 'src/doctor-schedule/entities/doctor-schedule.entity';
import { DoctorScheduleStatus } from 'src/doctor-schedule/enum/doctor-schedule-status.enum';
import { PayScheduleStripeTransactionDto } from './dto/pay-schedule-stripe-transaction.dto';
import { PayScheduleTransactionDto } from './dto/pay-schedule-momo-transaction.dto';
import { PayScheduleAccountBalanceTransactionDto } from './dto/pay-schedule-account-balance-transaction.dto';
import { EmailService } from 'src/email/email.service';
import { ScheduleProductTypeEnum } from 'src/doctor-schedule/enum/product_type.enum';
import { Course } from 'src/course/entities/course.entity';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationTypeEnum } from 'src/notification/enum/notification-type.enum';
import { RoleEnum } from 'src/role/enum/role.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TransactionService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,

    private readonly emailService: EmailService,

    private readonly notificationService: NotificationService,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectModel(DoctorSchedule.name)
    private readonly doctorScheduleModel: Model<DoctorScheduleDocument>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  slotOfDate = [
    ScheduleSlotEnum.SLOT1,
    ScheduleSlotEnum.SLOT2,
    ScheduleSlotEnum.SLOT3,
    ScheduleSlotEnum.SLOT4,
    ScheduleSlotEnum.SLOT5,
    ScheduleSlotEnum.SLOT6,
    ScheduleSlotEnum.SLOT7,
    ScheduleSlotEnum.SLOT8,
  ];

  timeOfSlot = [
    TimeOfSlotInSchedule.SLOT1,
    TimeOfSlotInSchedule.SLOT2,
    TimeOfSlotInSchedule.SLOT3,
    TimeOfSlotInSchedule.SLOT4,
    TimeOfSlotInSchedule.SLOT5,
    TimeOfSlotInSchedule.SLOT6,
    TimeOfSlotInSchedule.SLOT7,
    TimeOfSlotInSchedule.SLOT8,
  ];

  async addFundsByStripe(
    addFundTransactionDto: AddFundTransactionDto,
    user: any,
  ): Promise<string> {
    //Create Stripe checkout session
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: 'Nạp tiền vào tài khoản',
              },
              unit_amount: addFundTransactionDto.amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          order_id: `${user._id}-${new Date()
            .getTime()
            .toString()}2as4sad2-${new Date().getTime().toString()}`,
        },
        mode: 'payment',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // Hết hạn sau 30 phút
        customer_email: user.email,
        success_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
      });
      console.log(session);
      // Trả về URL để chuyển hướng khách hàng tới trang thanh toán
      return session.url;
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error.message);
      throw new Error('Could not create Stripe Checkout session');
    }
  }

  async payProductByStripe(
    payProductTransactionDto: PayProductStripeTransactionDto,
    user: any,
  ): Promise<string> {
    //Check exist Course
    const existingCourse = await this.courseModel.findOne({
      product_type: payProductTransactionDto.product_type,
      user_id: user._id,
    });
    if (existingCourse) {
      throw new BadGatewayException('Bạn đã mua khóa học này!');
    }

    // Create Stripe checkout session
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: `Thanh toán Khóa học: ${payProductTransactionDto.name}`,
                images: [payProductTransactionDto.image],
                description: `${payProductTransactionDto.description}`,
              },
              unit_amount: payProductTransactionDto.amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          order_id: `${user._id}-${new Date().getTime().toString()}-${new Date()
            .getTime()
            .toString()}-${payProductTransactionDto.product_type}`,
        },
        mode: 'payment',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // Hết hạn sau 30 phút
        customer_email: user.email,
        success_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
      });
      console.log(session);
      // Trả về URL để chuyển hướng khách hàng tới trang thanh toán
      return session.url;
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error.message);
      throw new Error('Could not create Stripe Checkout session');
    }
  }

  async payForScheduleByStripe(
    payScheduleTransactionDto: PayScheduleStripeTransactionDto,
    user: any,
  ): Promise<string> {
    //Check schedule before checkout
    const now = moment(new Date());
    const scheduleDate = moment(payScheduleTransactionDto.appointment_date);
    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(payScheduleTransactionDto.slot))
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() < 2
    ) {
      throw new BadRequestException(
        'Slot must be greater than the current time 2 hours',
      );
    }
    const doctor = await this.userModel
      .findById(payScheduleTransactionDto.doctor_id)
      .exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const checkExistSchedule = await this.doctorScheduleModel.findOne({
      doctor_id: doctor._id,
      appointment_date: payScheduleTransactionDto.appointment_date,
      slot: payScheduleTransactionDto.slot,
    });
    if (checkExistSchedule) {
      throw new BadRequestException('This slot already booked!');
    }

    // Create Stripe checkout session
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: `${payScheduleTransactionDto.name}`,
                images: [payScheduleTransactionDto.image],
                description: `${payScheduleTransactionDto.description}`,
              },
              unit_amount: payScheduleTransactionDto.amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          order_id: `${user._id}-${new Date()
            .getTime()
            .toString()}2ad5ad23at3awe1-${new Date().getTime().toString()}-${
            payScheduleTransactionDto.product_type
          }`,
          schedule_data: `${payScheduleTransactionDto.doctor_id}-${payScheduleTransactionDto.appointment_date}-${payScheduleTransactionDto.slot}-${payScheduleTransactionDto.examination_form}`,
        },
        mode: 'payment',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // Hết hạn sau 30 phút
        customer_email: user.email,
        success_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get(
          'ReturnStripePaymentUrl',
        )}?session_id={CHECKOUT_SESSION_ID}`,
      });
      console.log(session);
      // Trả về URL để chuyển hướng khách hàng tới trang thanh toán
      return session.url;
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error.message);
      throw new Error('Could not create Stripe Checkout session');
    }
  }

  async paymentStripeCallback(data: any): Promise<any> {
    const result = await this.stripe.checkout.sessions.retrieve(
      data.session_id,
    );
    const user_id = result.metadata.order_id.split('-')[0];
    const transaction_type = result.metadata.order_id.split('-')[1];
    const current_time = result.metadata.order_id.split('-')[2];
    const amount = result.amount_total;

    if (result.payment_status !== 'paid') {
      let transaction = null;
      if (transaction_type === `${current_time}2as4sad2`) {
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.STRIPE,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
        });
        await transaction.save();
      } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
        const product_type = result.metadata.order_id.split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.STRIPE,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.SCHEDULE,
          product_type,
        });
        await transaction.save();

        return {
          redirectUrl: `https://hemedy.onrender.com/connection`,
        };
      } else {
        const product_type = result.metadata.order_id.split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.STRIPE,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.PAY,
          product_type,
        });
        await transaction.save();
      }

      return {
        redirectUrl: `https://hemedy.onrender.com/session`,
      };
    }

    let transaction = null;
    if (transaction_type === `${current_time}2as4sad2`) {
      //create transaction
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.STRIPE,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.ADD_FUNDS,
      });
      await transaction.save();

      const user = await this.userModel.findById(transaction.user_id);
      user.account_balance += amount;
      await user.save();
    } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
      const product_type = result.metadata.order_id.split('-')[3];
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.STRIPE,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.SCHEDULE,
        product_type,
      });
      await transaction.save();

      //Create schedule
      const schedule_data = result.metadata.schedule_data.split('-');
      const doctor_id = schedule_data[0];
      const appointment_date = schedule_data[1];
      const slot = schedule_data[2];
      const examination_form = schedule_data[3];
      const newDoctorSchedule = new this.doctorScheduleModel({
        customer_id: user_id,
        doctor_id,
        appointment_date,
        slot,
        examination_form,
        max_examination_session:
          product_type == ScheduleProductTypeEnum.BASIC_MEDICAL_EXAMINATION
            ? 3
            : 8,
        status: DoctorScheduleStatus.PENDING,
      });
      await newDoctorSchedule.save();

      //Send mail for customer
      const doctor = await this.userModel.findById(doctor_id);
      const customer = await this.userModel.findById(user_id);
      const appointment_date_email =
        moment(appointment_date).format('DD-MM-YYYY');
      const scheduleTime = this.timeOfSlot
        .find((s) => s.includes(slot))
        .split('-')[1];
      const slot_email = `${
        Number.parseInt(scheduleTime) >= 12
          ? `${Number.parseInt(scheduleTime)}h30`
          : `${Number.parseInt(scheduleTime)}h`
      }-${
        Number.parseInt(scheduleTime) >= 12
          ? `${Number.parseInt(scheduleTime) + 1}h30`
          : `${Number.parseInt(scheduleTime) + 1}h`
      }`;
      await this.emailService.sendMailWhenScheduleSuccess(
        customer.email,
        customer.fullname,
        appointment_date_email,
        slot_email,
        doctor.fullname,
      );

      //Push notification
      //Notification to admin
      const admin = await this.userModel.findOne({
        role_name: RoleEnum.ADMIN,
      });
      const createNotificationAdminDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_SCHEDULED,
          `Đã có khách hàng đặt lịch hẹn khám mới`,
          admin.email,
        );

      await this.notificationService.createNotification(
        createNotificationAdminDto,
      );

      // Notification to doctor
      const createNotificationDoctorDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_SCHEDULED,
          `Đã có khách hàng đặt lịch hẹn khám mới`,
          doctor.email,
        );

      await this.notificationService.createNotification(
        createNotificationDoctorDto,
      );
    } else {
      //Create Transaction
      const product_type = result.metadata.order_id.split('-')[3];
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.STRIPE,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.PAY,
        product_type,
      });
      await transaction.save();

      //Create Course
      const createdCourse = new this.courseModel({
        product_type,
        user_id,
      });
      await createdCourse.save();

      //Create Notification
      const admin = await this.userModel.findOne({
        role_name: RoleEnum.ADMIN,
      });
      const createNotificationDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_PRODUCT,
          `Đã có khách hàng mua khóa học`,
          admin.email,
        );

      await this.notificationService.createNotification(createNotificationDto);
    }

    return {
      redirectUrl: `https://hemedy.onrender.com/account`,
    };
  }

  async addFundsByMoMo(
    addFundTransactionDto: AddFundTransactionDto,
    user: any,
  ): Promise<string> {
    // create momo url
    const partnerCode: string = this.configService.get('PartnerCode');
    const accessKey: string = this.configService.get('AccessKey');
    const secretKey: string = this.configService.get('SecretKey');
    const MoMoApiUrl: string = this.configService.get('MoMoApiUrl');
    const ipnUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const redirectUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const orderId = `${user._id}-${new Date()
      .getTime()
      .toString()}2as4sad2-${new Date().getTime().toString()}`;
    const requestId = orderId;
    const orderInfo = `Nạp tiền vào tài khoản`;
    const requestType = 'captureWallet';
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const amount = addFundTransactionDto.amount;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    const options = {
      method: 'POST',
      url: MoMoApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else {
        console.error('Error:', error.message);
      }
      throw new Error('Không thể tạo yêu cầu thanh toán MoMo');
    }
  }

  async payProductByMoMo(
    payProductTransactionDto: PayProductTransactionDto,
    user: any,
  ): Promise<string> {
    //Check exist Course
    const existingCourse = await this.courseModel.findOne({
      product_type: payProductTransactionDto.product_type,
      user_id: user._id,
    });
    if (existingCourse) {
      throw new BadGatewayException('Bạn đã mua khóa học này!');
    }

    // create momo url
    const partnerCode: string = this.configService.get('PartnerCode');
    const accessKey: string = this.configService.get('AccessKey');
    const secretKey: string = this.configService.get('SecretKey');
    const MoMoApiUrl: string = this.configService.get('MoMoApiUrl');
    const ipnUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const redirectUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const orderId = `${user._id}-${new Date().getTime().toString()}-${new Date()
      .getTime()
      .toString()}-${payProductTransactionDto.product_type}`;
    const requestId = orderId;
    const orderInfo = `Thanh toán sản phẩm: ${payProductTransactionDto.name}`;
    const requestType = 'captureWallet';
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const amount = payProductTransactionDto.amount;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    const options = {
      method: 'POST',
      url: MoMoApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else {
        console.error('Error:', error.message);
      }
      throw new Error('Không thể tạo yêu cầu thanh toán MoMo');
    }
  }

  async payForScheduleByMoMo(
    payScheduleTransactionDto: PayScheduleTransactionDto,
    user: any,
  ): Promise<string> {
    //Check schedule before checkout
    const now = moment(new Date());
    const scheduleDate = moment(payScheduleTransactionDto.appointment_date);
    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(payScheduleTransactionDto.slot))
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() < 2
    ) {
      throw new BadRequestException(
        'Slot must be greater than the current time 2 hours',
      );
    }
    const doctor = await this.userModel
      .findById(payScheduleTransactionDto.doctor_id)
      .exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const checkExistSchedule = await this.doctorScheduleModel.findOne({
      doctor_id: doctor._id,
      appointment_date: payScheduleTransactionDto.appointment_date,
      slot: payScheduleTransactionDto.slot,
    });
    if (checkExistSchedule) {
      throw new BadRequestException('This slot already booked!');
    }

    // create momo url
    const partnerCode: string = this.configService.get('PartnerCode');
    const accessKey: string = this.configService.get('AccessKey');
    const secretKey: string = this.configService.get('SecretKey');
    const MoMoApiUrl: string = this.configService.get('MoMoApiUrl');
    const ipnUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const redirectUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const orderId = `${user._id}-${new Date()
      .getTime()
      .toString()}2ad5ad23at3awe1-${new Date().getTime().toString()}-${
      payScheduleTransactionDto.product_type
    }`;
    const requestId = `${payScheduleTransactionDto.doctor_id}-${
      payScheduleTransactionDto.appointment_date
    }-${payScheduleTransactionDto.slot}-${
      payScheduleTransactionDto.examination_form
    }-${new Date().getTime().toString()}`;
    const orderInfo = `${payScheduleTransactionDto.name}`;
    const requestType = 'captureWallet';
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const amount = payScheduleTransactionDto.amount;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    const options = {
      method: 'POST',
      url: MoMoApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else {
        console.error('Error:', error.message);
      }
      throw new Error('Không thể tạo yêu cầu thanh toán MoMo');
    }
  }

  async paymentMoMoCallback(data: any): Promise<any> {
    const user_id: number = data.orderId.split('-')[0];
    const transaction_type = data.orderId.split('-')[1];
    const current_time = data.orderId.split('-')[2];
    const amount = Number.parseInt(data.amount);

    if (data.message !== 'Thành công.') {
      let transaction = null;
      if (transaction_type === `${current_time}2as4sad2`) {
        //create transaction
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.MOMO,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
        });
        await transaction.save();
      } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
        const product_type = data.orderId.split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.MOMO,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.SCHEDULE,
          product_type,
        });
        await transaction.save();

        return {
          redirectUrl: `https://hemedy.onrender.com/connection`,
        };
      } else {
        const product_type = data.orderId.split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.MOMO,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.PAY,
          product_type,
        });
        await transaction.save();
      }

      return {
        redirectUrl: `https://hemedy.onrender.com/session`,
      };
    }

    let transaction = null;
    if (transaction_type === `${current_time}2as4sad2`) {
      //create transaction
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.MOMO,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.ADD_FUNDS,
      });
      await transaction.save();

      const user = await this.userModel.findById(transaction.user_id);
      user.account_balance += amount;
      await user.save();
    } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
      const product_type = data.orderId.split('-')[3];
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.MOMO,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.SCHEDULE,
        product_type,
      });
      await transaction.save();

      //Create schedule
      const schedule_data = data.requestId.split('-');
      const doctor_id = schedule_data[0];
      const appointment_date = schedule_data[1];
      const slot = schedule_data[2];
      const examination_form = schedule_data[3];
      const newDoctorSchedule = new this.doctorScheduleModel({
        customer_id: user_id,
        doctor_id,
        appointment_date,
        slot,
        examination_form,
        max_examination_session:
          product_type == ScheduleProductTypeEnum.BASIC_MEDICAL_EXAMINATION
            ? 3
            : 8,
        status: DoctorScheduleStatus.PENDING,
      });
      await newDoctorSchedule.save();

      //Send mail for customer
      const doctor = await this.userModel.findById(doctor_id);
      const customer = await this.userModel.findById(user_id);
      const appointment_date_email =
        moment(appointment_date).format('DD-MM-YYYY');
      const scheduleTime = this.timeOfSlot
        .find((s) => s.includes(slot))
        .split('-')[1];
      const slot_email = `${
        Number.parseInt(scheduleTime) >= 12
          ? `${Number.parseInt(scheduleTime)}h30`
          : `${Number.parseInt(scheduleTime)}h`
      }-${
        Number.parseInt(scheduleTime) >= 12
          ? `${Number.parseInt(scheduleTime) + 1}h30`
          : `${Number.parseInt(scheduleTime) + 1}h`
      }`;
      await this.emailService.sendMailWhenScheduleSuccess(
        customer.email,
        customer.fullname,
        appointment_date_email,
        slot_email,
        doctor.fullname,
      );

      //Push notification
      //Notification to admin
      const admin = await this.userModel.findOne({
        role_name: RoleEnum.ADMIN,
      });
      const createNotificationAdminDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_SCHEDULED,
          `Đã có khách hàng đặt lịch hẹn khám mới`,
          admin.email,
        );

      await this.notificationService.createNotification(
        createNotificationAdminDto,
      );

      // Notification to doctor
      const createNotificationDoctorDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_SCHEDULED,
          `Đã có khách hàng đặt lịch hẹn khám mới`,
          doctor.email,
        );

      await this.notificationService.createNotification(
        createNotificationDoctorDto,
      );
    } else {
      const product_type = data.orderId.split('-')[3];
      transaction = new this.transactionModel({
        user_id,
        transaction_code: `${user_id}-${transaction_type}-${current_time}`,
        payment_type: PaymentTypeEnum.MOMO,
        amount,
        status: TransactionStatusEnum.SUCCESS,
        transaction_type: TransactionTypeEnum.PAY,
        product_type,
      });
      await transaction.save();

      //Create Course
      const createdCourse = new this.courseModel({
        product_type,
        user_id,
      });
      await createdCourse.save();

      //Push Notification
      const admin = await this.userModel.findOne({
        role_name: RoleEnum.ADMIN,
      });
      const createNotificationDto: CreateNotificationDto =
        new CreateNotificationDto(
          NotificationTypeEnum.PAY_PRODUCT,
          `Đã có khách hàng mua khóa học`,
          admin.email,
        );

      await this.notificationService.createNotification(createNotificationDto);
    }

    return {
      redirectUrl: `https://hemedy.onrender.com/account`,
    };
  }

  async addFundsByVNPay(
    addFundTransactionDto: AddFundTransactionDto,
    user: any,
    req: Request,
  ): Promise<string> {
    // create vnpay url
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = this.configService.get('TmnCode');
    const secretKey = this.configService.get('HashSecret');
    let vnpUrl = this.configService.get('BaseUrl');
    const returnUrl = this.configService.get('ReturnVnPayPaymentUrl');

    const date = new Date();

    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = addFundTransactionDto.amount;
    const bankCode = '';

    const orderInfo = `${user._id}-${new Date()
      .getTime()
      .toString()}2as4sad2-${new Date().getTime().toString()}`;
    const orderType = orderInfo;
    const locale = 'vn';

    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  async payProductByVNPay(
    payProductTransactionDto: PayProductTransactionDto,
    user: any,
    req: Request,
  ): Promise<string> {
    //Check exist Course
    const existingCourse = await this.courseModel.findOne({
      product_type: payProductTransactionDto.product_type,
      user_id: user._id,
    });
    if (existingCourse) {
      throw new BadGatewayException('Bạn đã mua khóa học này!');
    }

    // create vnpay url
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = this.configService.get('TmnCode');
    const secretKey = this.configService.get('HashSecret');
    let vnpUrl = this.configService.get('BaseUrl');
    const returnUrl = this.configService.get('ReturnVnPayPaymentUrl');

    const date = new Date();

    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = payProductTransactionDto.amount;
    const bankCode = '';

    const orderInfo = `${user._id}-${new Date()
      .getTime()
      .toString()}-${new Date().getTime().toString()}-${
      payProductTransactionDto.product_type
    }`;
    const orderType = orderInfo;
    const locale = 'vn';

    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  async payForScheduleByVNPay(
    payScheduleTransactionDto: PayScheduleTransactionDto,
    user: any,
    req: Request,
  ): Promise<string> {
    //Check schedule before checkout
    const now = moment(new Date());
    const scheduleDate = moment(payScheduleTransactionDto.appointment_date);
    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(payScheduleTransactionDto.slot))
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() < 2
    ) {
      throw new BadRequestException(
        'Slot must be greater than the current time 2 hours',
      );
    }
    const doctor = await this.userModel
      .findById(payScheduleTransactionDto.doctor_id)
      .exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const checkExistSchedule = await this.doctorScheduleModel.findOne({
      doctor_id: doctor._id,
      appointment_date: payScheduleTransactionDto.appointment_date,
      slot: payScheduleTransactionDto.slot,
    });
    if (checkExistSchedule) {
      throw new BadRequestException('This slot already booked!');
    }

    // create vnpay url
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = this.configService.get('TmnCode');
    const secretKey = this.configService.get('HashSecret');
    let vnpUrl = this.configService.get('BaseUrl');
    const returnUrl = this.configService.get('ReturnVnPayPaymentUrl');

    const date = new Date();

    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = payScheduleTransactionDto.amount;
    const bankCode = '';

    const orderInfo = `${user._id}-${new Date()
      .getTime()
      .toString()}-${new Date().getTime().toString()}-${
      payScheduleTransactionDto.product_type
    }`;
    const orderType = `${payScheduleTransactionDto.doctor_id}-${
      payScheduleTransactionDto.appointment_date
    }-${payScheduleTransactionDto.slot}-${
      payScheduleTransactionDto.examination_form
    }-${new Date().getTime().toString()}`;
    const locale = 'vn';

    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  async paymentVnPayCallback(data: any): Promise<any> {
    let vnp_Params = data;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = this.configService.get('HashSecret');

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    const user_id: number = vnp_Params['vnp_OrderInfo'].split('-')[0];
    const transaction_type = vnp_Params['vnp_OrderInfo'].split('-')[1];
    const current_time = vnp_Params['vnp_OrderInfo'].split('-')[2];
    const amount = vnp_Params['vnp_Amount'];

    if (secureHash === signed && vnp_Params['vnp_ResponseCode'] === '00') {
      let transaction = null;
      if (transaction_type === `${current_time}2as4sad2`) {
        //create transaction
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.SUCCESS,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
        });
        await transaction.save();

        const user = await this.userModel.findById(user_id);
        user.account_balance += amount;
        await user.save();
      } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
        const product_type = vnp_Params['vnp_OrderInfo'].split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.SUCCESS,
          transaction_type: TransactionTypeEnum.SCHEDULE,
          product_type,
        });
        await transaction.save();

        //Create schedule
        const schedule_data = vnp_Params['vnp_OrderType'].split('-');
        const doctor_id = schedule_data[0];
        const appointment_date = schedule_data[1];
        const slot = schedule_data[2];
        const examination_form = schedule_data[3];
        const newDoctorSchedule = new this.doctorScheduleModel({
          customer_id: user_id,
          doctor_id,
          appointment_date,
          slot,
          examination_form,
          max_examination_session:
            product_type == ScheduleProductTypeEnum.BASIC_MEDICAL_EXAMINATION
              ? 3
              : 8,
          status: DoctorScheduleStatus.PENDING,
        });
        await newDoctorSchedule.save();

        //Send mail for customer
        const doctor = await this.userModel.findById(doctor_id);
        const customer = await this.userModel.findById(user_id);
        const appointment_date_email =
          moment(appointment_date).format('DD-MM-YYYY');
        const scheduleTime = this.timeOfSlot
          .find((s) => s.includes(slot))
          .split('-')[1];
        const slot_email = `${
          Number.parseInt(scheduleTime) >= 12
            ? `${Number.parseInt(scheduleTime)}h30`
            : `${Number.parseInt(scheduleTime)}h`
        }-${
          Number.parseInt(scheduleTime) >= 12
            ? `${Number.parseInt(scheduleTime) + 1}h30`
            : `${Number.parseInt(scheduleTime) + 1}h`
        }`;
        await this.emailService.sendMailWhenScheduleSuccess(
          customer.email,
          customer.fullname,
          appointment_date_email,
          slot_email,
          doctor.fullname,
        );

        //Push notification
        //Notification to admin
        const admin = await this.userModel.findOne({
          role_name: RoleEnum.ADMIN,
        });
        const createNotificationAdminDto: CreateNotificationDto =
          new CreateNotificationDto(
            NotificationTypeEnum.PAY_SCHEDULED,
            `Đã có khách hàng đặt lịch hẹn khám mới`,
            admin.email,
          );

        await this.notificationService.createNotification(
          createNotificationAdminDto,
        );

        // Notification to doctor
        const createNotificationDoctorDto: CreateNotificationDto =
          new CreateNotificationDto(
            NotificationTypeEnum.PAY_SCHEDULED,
            `Đã có khách hàng đặt lịch hẹn khám mới`,
            doctor.email,
          );

        await this.notificationService.createNotification(
          createNotificationDoctorDto,
        );
      } else {
        const product_type = vnp_Params['vnp_OrderInfo'].split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.SUCCESS,
          transaction_type: TransactionTypeEnum.PAY,
          product_type,
        });
        await transaction.save();

        //Create Course
        const createdCourse = new this.courseModel({
          product_type,
          user_id,
        });
        await createdCourse.save();

        //Create Notification
        const admin = await this.userModel.findOne({
          role_name: RoleEnum.ADMIN,
        });
        const createNotificationDto: CreateNotificationDto =
          new CreateNotificationDto(
            NotificationTypeEnum.PAY_PRODUCT,
            `Đã có khách hàng mua khóa học`,
            admin.email,
          );

        await this.notificationService.createNotification(
          createNotificationDto,
        );
      }

      return {
        redirectUrl: `https://hemedy.onrender.com/account`,
      };
    } else {
      let transaction = null;
      if (transaction_type === `${current_time}2as4sad2`) {
        //create transaction
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.ADD_FUNDS,
        });
        await transaction.save();
      } else if (transaction_type === `${current_time}2ad5ad23at3awe1`) {
        const product_type = vnp_Params['vnp_OrderInfo'].split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.SCHEDULE,
          product_type,
        });
        await transaction.save();

        return {
          redirectUrl: `https://hemedy.onrender.com/connection`,
        };
      } else {
        const product_type = vnp_Params['vnp_OrderInfo'].split('-')[3];
        transaction = new this.transactionModel({
          user_id,
          transaction_code: `${user_id}-${transaction_type}-${current_time}`,
          payment_type: PaymentTypeEnum.VNPAY,
          amount,
          status: TransactionStatusEnum.FAILURE,
          transaction_type: TransactionTypeEnum.PAY,
          product_type,
        });
        await transaction.save();
      }

      return {
        redirectUrl: `https://hemedy.onrender.com/session`,
      };
    }
  }

  async payProductByAccountBalance(
    user: any,
    payProductAccountBalanceTransactionDto: PayProductAccountBalanceTransactionDto,
  ): Promise<Transaction> {
    //Check exist Course
    const existingCourse = await this.courseModel.findOne({
      product_type: payProductAccountBalanceTransactionDto.product_type,
      user_id: user._id,
    });
    if (existingCourse) {
      throw new BadGatewayException('Bạn đã mua khóa học này!');
    }

    if (user.account_balance < payProductAccountBalanceTransactionDto.amount) {
      throw new BadGatewayException(
        'Số dư tài khoản không đủ để thực hiện thanh toán. Vui lòng chọn hình thức khác hoặc nạp tiền vào tài khoản!',
      );
    }
    const current_time = new Date().getTime().toString();

    const transaction = new this.transactionModel({
      user_id: user._id,
      transaction_code: `${user._id}-${current_time}2ad5ad23at3awe1-${current_time}`,
      payment_type: PaymentTypeEnum.ACCOUNT_BALANCE,
      amount: payProductAccountBalanceTransactionDto.amount,
      status: TransactionStatusEnum.SUCCESS,
      transaction_type: TransactionTypeEnum.SCHEDULE,
      product_type: payProductAccountBalanceTransactionDto.product_type,
    });
    await transaction.save();

    const new_balance =
      user.account_balance - payProductAccountBalanceTransactionDto.amount;
    await this.userModel.findByIdAndUpdate(
      user._id,
      { account_balance: new_balance },
      { new: true },
    );

    //Create Course
    const createdCourse = new this.courseModel({
      product_type: payProductAccountBalanceTransactionDto.product_type,
      user_id: user._id,
    });
    await createdCourse.save();

    //Create Notification
    const admin = await this.userModel.findOne({
      role_name: RoleEnum.ADMIN,
    });
    const createNotificationDto: CreateNotificationDto =
      new CreateNotificationDto(
        NotificationTypeEnum.PAY_PRODUCT,
        `Đã có khách hàng mua khóa học`,
        admin.email,
      );

    await this.notificationService.createNotification(createNotificationDto);

    return transaction;
  }

  async payForScheduleByAccountBalance(
    user: any,
    payScheduleAccountBalanceTransactionDto: PayScheduleAccountBalanceTransactionDto,
  ): Promise<Transaction> {
    if (user.account_balance < payScheduleAccountBalanceTransactionDto.amount) {
      throw new BadGatewayException(
        'Số dư tài khoản không đủ để thực hiện thanh toán. Vui lòng chọn hình thức khác hoặc nạp tiền vào tài khoản!',
      );
    }

    //Check schedule before checkout
    const now = moment(new Date());
    const scheduleDate = moment(
      payScheduleAccountBalanceTransactionDto.appointment_date,
    );
    const scheduleTime = this.timeOfSlot
      .find((slot) =>
        slot.includes(payScheduleAccountBalanceTransactionDto.slot),
      )
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() < 2
    ) {
      throw new BadRequestException(
        'Slot must be greater than the current time 2 hours',
      );
    }
    const doctor = await this.userModel
      .findById(payScheduleAccountBalanceTransactionDto.doctor_id)
      .exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const checkExistSchedule = await this.doctorScheduleModel.findOne({
      doctor_id: doctor._id,
      appointment_date:
        payScheduleAccountBalanceTransactionDto.appointment_date,
      slot: payScheduleAccountBalanceTransactionDto.slot,
    });
    if (checkExistSchedule) {
      throw new BadRequestException('This slot already booked!');
    }

    const current_time = new Date().getTime().toString();
    const transaction = new this.transactionModel({
      user_id: user._id,
      transaction_code: `${user._id}-${current_time}2ad5ad23at3awe1-${current_time}`,
      payment_type: PaymentTypeEnum.ACCOUNT_BALANCE,
      amount: payScheduleAccountBalanceTransactionDto.amount,
      status: TransactionStatusEnum.SUCCESS,
      transaction_type: TransactionTypeEnum.SCHEDULE,
      product_type: payScheduleAccountBalanceTransactionDto.product_type,
    });
    await transaction.save();

    const new_balance =
      user.account_balance - payScheduleAccountBalanceTransactionDto.amount;
    await this.userModel.findByIdAndUpdate(
      user._id,
      { account_balance: new_balance },
      { new: true },
    );

    //Create schedule
    const doctor_id = payScheduleAccountBalanceTransactionDto.doctor_id;
    const appointment_date =
      payScheduleAccountBalanceTransactionDto.appointment_date;
    const slot = payScheduleAccountBalanceTransactionDto.slot;
    const examination_form =
      payScheduleAccountBalanceTransactionDto.examination_form;
    const newDoctorSchedule = new this.doctorScheduleModel({
      customer_id: user._id,
      doctor_id,
      appointment_date,
      slot,
      examination_form,
      max_examination_session:
        payScheduleAccountBalanceTransactionDto.product_type ==
        ScheduleProductTypeEnum.BASIC_MEDICAL_EXAMINATION
          ? 3
          : 8,
      status: DoctorScheduleStatus.PENDING,
    });
    await newDoctorSchedule.save();

    //Send mail for customer
    const appointment_date_email =
      moment(appointment_date).format('DD-MM-YYYY');
    const slot_email = `${
      Number.parseInt(scheduleTime) >= 12
        ? `${Number.parseInt(scheduleTime)}h30`
        : `${Number.parseInt(scheduleTime)}h`
    }-${
      Number.parseInt(scheduleTime) >= 12
        ? `${Number.parseInt(scheduleTime) + 1}h30`
        : `${Number.parseInt(scheduleTime) + 1}h`
    }`;
    await this.emailService.sendMailWhenScheduleSuccess(
      user.email,
      user.fullname,
      appointment_date_email,
      slot_email,
      doctor.fullname,
    );

    //Push notification
    //Notification to admin
    const admin = await this.userModel.findOne({
      role_name: RoleEnum.ADMIN,
    });
    const createNotificationAdminDto: CreateNotificationDto =
      new CreateNotificationDto(
        NotificationTypeEnum.PAY_SCHEDULED,
        `Đã có khách hàng đặt lịch hẹn khám mới`,
        admin.email,
      );

    await this.notificationService.createNotification(
      createNotificationAdminDto,
    );

    // Notification to doctor
    const createNotificationDoctorDto: CreateNotificationDto =
      new CreateNotificationDto(
        NotificationTypeEnum.PAY_SCHEDULED,
        `Đã có khách hàng đặt lịch hẹn khám mới`,
        doctor.email,
      );

    await this.notificationService.createNotification(
      createNotificationDoctorDto,
    );

    return transaction;
  }

  async getAllCoursesOfUser(user: any): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find({
      user_id: user._id,
      transaction_type: TransactionTypeEnum.PAY,
    });
    if (!transactions) {
      throw new InternalServerErrorException(
        'Something went wrong when getting all courses',
      );
    }
    return transactions;
  }

  async getAllTransactionOfUser(user: any): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find({
      user_id: user._id,
    });
    if (!transactions) {
      throw new InternalServerErrorException(
        'Something went wrong when getting all courses',
      );
    }
    return transactions;
  }

  async getAllTransactionByAdmin(): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find()
      .populate('user_id')
      .sort({ createdAt: -1 });
    if (!transactions) {
      throw new InternalServerErrorException(
        'Something went wrong when getting all courses',
      );
    }
    return transactions;
  }

  sortObject = (obj: any) => {
    const sorted = {};
    const str = [];
    let key: any;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  };
}
