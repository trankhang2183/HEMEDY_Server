import { PayProductTransactionDto } from './dto/pay-product-transaction.dto';
import { AddFundTransactionDto } from './dto/add-funds-transaction.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { Request } from 'express';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Transaction } from './entities/transaction.entity';
import { PaymentTypeEnum } from './enum/paymen-type.enum';
import { TransactionStatusEnum } from './enum/transaction-status.enum';
import { TransactionTypeEnum } from './enum/transaction-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectQueue('transaction')
    private readonly transactionQueue: Queue,
  ) {}

  async addFundsByMoMo(
    addFundTransactionDto: AddFundTransactionDto,
    user: any,
  ): Promise<string> {
    //create transaction
    const transaction = new this.transactionModel({
      user_id: user._id,
      payment_type: PaymentTypeEnum.MOMO,
      amount: addFundTransactionDto.amount,
      status: TransactionStatusEnum.WAITING,
      transaction_type: TransactionTypeEnum.ADD_FUNDS,
    });

    await transaction.save();

    // create momo url
    const partnerCode: string = this.configService.get('PartnerCode');
    const accessKey: string = this.configService.get('AccessKey');
    const secretKey: string = this.configService.get('SecretKey');
    const MoMoApiUrl: string = this.configService.get('MoMoApiUrl');
    const ipnUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const redirectUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const orderId = `${transaction._id}-${
      TransactionTypeEnum.ADD_FUNDS
    }-${new Date().getTime().toString()}`;
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
    //create transaction
    const transaction = new this.transactionModel({
      user_id: user._id,
      payment_type: PaymentTypeEnum.MOMO,
      amount: payProductTransactionDto.amount,
      status: TransactionStatusEnum.WAITING,
      transaction_type: TransactionTypeEnum.PAY,
      product_type: payProductTransactionDto.product_type,
    });

    await transaction.save();

    // create momo url
    const partnerCode: string = this.configService.get('PartnerCode');
    const accessKey: string = this.configService.get('AccessKey');
    const secretKey: string = this.configService.get('SecretKey');
    const MoMoApiUrl: string = this.configService.get('MoMoApiUrl');
    const ipnUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const redirectUrl = this.configService.get('ReturnMoMoPaymentUrl');
    const orderId = `${transaction._id}-${
      TransactionTypeEnum.ADD_FUNDS
    }-${new Date().getTime().toString()}`;
    const requestId = orderId;
    const orderInfo = `Thanh toán sản phẩm`;
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

  async paymentMoMoCallback(data: any): Promise<Transaction> {
    const transaction_id: number = data.orderId.split('-')[0];
    const transaction_type = data.orderId.split('-')[1];
    const transaction = await this.transactionModel.findById(transaction_id);
    transaction.status = TransactionStatusEnum.SUCCESS;
    await transaction.save();

    if (transaction_type === TransactionTypeEnum.ADD_FUNDS) {
      const user = await this.userModel.findById(transaction.user_id);
      user.account_balance += Number.parseInt(data.amount);
      await user.save();
    }

    return transaction;
    // return {
    //   redirectUrl: `http://local-culture-projects.onrender.com/project/view`,
    // };
  }

  async addFundsByVNPay(
    addFundTransactionDto: AddFundTransactionDto,
    user: any,
    req: Request,
  ): Promise<string> {
    //create transaction
    const transaction = new this.transactionModel({
      user_id: user._id,
      payment_type: PaymentTypeEnum.MOMO,
      amount: addFundTransactionDto.amount,
      status: TransactionStatusEnum.WAITING,
      transaction_type: TransactionTypeEnum.ADD_FUNDS,
    });

    await transaction.save();

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

    const orderInfo = `${transaction._id}-${
      TransactionTypeEnum.ADD_FUNDS
    }-${new Date().getTime().toString()}`;
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
    //create transaction
    const transaction = new this.transactionModel({
      user_id: user._id,
      payment_type: PaymentTypeEnum.MOMO,
      amount: payProductTransactionDto.amount,
      status: TransactionStatusEnum.WAITING,
      transaction_type: TransactionTypeEnum.PAY,
      product_type: payProductTransactionDto.product_type,
    });

    await transaction.save();

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

    const orderInfo = `${transaction._id}-${
      TransactionTypeEnum.ADD_FUNDS
    }-${new Date().getTime().toString()}`;
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

  async paymentVnPayCallback(data: any): Promise<Transaction> {
    let vnp_Params = data;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = this.configService.get('HashSecret');

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed && vnp_Params['vnp_ResponseCode'] === '00') {
      const transaction_id: number = vnp_Params['vnp_OrderInfo'].split('-')[0];

      const transaction_type = vnp_Params['vnp_OrderInfo'].split('-')[1];
      const transaction = await this.transactionModel.findById(transaction_id);
      transaction.status = TransactionStatusEnum.SUCCESS;
      await transaction.save();

      if (transaction_type === TransactionTypeEnum.ADD_FUNDS) {
        const user = await this.userModel.findById(transaction.user_id);
        user.account_balance += transaction.amount;
        await user.save();
      }

      return transaction;
      // return {
      //   redirectUrl: `http://local-culture-projects.onrender.com/project/view`,
      // };
    } else {
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi thanh toán với VNPay',
      );
    }
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
