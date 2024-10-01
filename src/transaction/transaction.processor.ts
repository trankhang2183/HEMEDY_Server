import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './entities/transaction.entity';
import { Model } from 'mongoose';

@Processor('transaction')
export class TransactionProcessor {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  @Process('checkPayment')
  async handleCheckPayment(job: Job) {
    const { transactionId } = job.data;
    const transaction = await this.transactionModel.findById(transactionId);
    if (transaction.status === 'Waiting') {
      await this.transactionModel.findByIdAndUpdate(transactionId, {
        status: 'Failure',
      });
    }
  }
}
