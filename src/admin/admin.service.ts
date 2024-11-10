import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DomainModel } from 'src/auth/entities/domain.entity';
import { DomainEnum } from 'src/auth/enum/domain.enum';
import { Blog } from 'src/blog/entities/blog.entity';
import { Course } from 'src/course/entities/course.entity';
import { DoctorSchedule } from 'src/doctor-schedule/entities/doctor-schedule.entity';
import { ScheduleExaminationFormEnum } from 'src/doctor-schedule/enum/examination-form.enum';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { PodcastCategoryEnum } from 'src/podcast/enum/podcast-category.enum';
import { Survey } from 'src/survey/entities/survey.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionTypeEnum } from 'src/transaction/enum/transaction-type.enum';
import { User } from 'src/user/entities/user.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Workshop.name) private readonly workshopModel: Model<Workshop>,
    @InjectModel(Podcast.name) private readonly podcastModel: Model<Podcast>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(DoctorSchedule.name)
    private readonly doctorScheduleModel: Model<DoctorSchedule>,
    @InjectModel(DomainModel.name)
    private readonly domainModel: Model<DomainModel>,
  ) {}

  async statisticForAdmin(): Promise<any> {
    const result = {
      blog: await this.blogModel.countDocuments(),
      workshop: await this.workshopModel.countDocuments(),
      podcast_podcast: await this.podcastModel.countDocuments({
        category: PodcastCategoryEnum.PODCAST,
      }),
      podcast_music: await this.podcastModel.countDocuments({
        category: PodcastCategoryEnum.MUSIC,
      }),
      survey: await this.surveyModel.countDocuments(),
    };

    return result;
  }

  async statisticSales(param: string): Promise<any> {
    const now = new Date();
    let startOfPeriod: Date,
      endOfPeriod: Date,
      startOfPreviousPeriod: Date,
      endOfPreviousPeriod: Date;

    switch (param) {
      case 'today':
        startOfPeriod = new Date(now);
        startOfPeriod.setHours(0, 0, 0, 0);
        endOfPeriod = new Date(now);
        endOfPeriod.setHours(23, 59, 59, 999);

        startOfPreviousPeriod = new Date(startOfPeriod);
        startOfPreviousPeriod.setDate(startOfPreviousPeriod.getDate() - 1);
        endOfPreviousPeriod = new Date(endOfPeriod);
        endOfPreviousPeriod.setDate(endOfPreviousPeriod.getDate() - 1);
        break;

      case 'week':
        startOfPeriod = new Date(now);
        startOfPeriod.setDate(
          now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1),
        );
        startOfPeriod.setHours(0, 0, 0, 0);

        endOfPeriod = new Date(now);
        endOfPeriod.setHours(23, 59, 59, 999);

        startOfPreviousPeriod = new Date(startOfPeriod);
        startOfPreviousPeriod.setDate(startOfPreviousPeriod.getDate() - 7);

        endOfPreviousPeriod = new Date(startOfPreviousPeriod);
        endOfPreviousPeriod.setDate(endOfPreviousPeriod.getDate() + 6);
        endOfPreviousPeriod.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
        endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfPeriod.setHours(23, 59, 59, 999);

        startOfPreviousPeriod = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        endOfPreviousPeriod = new Date(now.getFullYear(), now.getMonth(), 0);
        endOfPreviousPeriod.setHours(23, 59, 59, 999);
        break;

      case 'year':
        startOfPeriod = new Date(now.getFullYear(), 0, 1);
        endOfPeriod = new Date(now.getFullYear(), 11, 31);
        endOfPeriod.setHours(23, 59, 59, 999);

        startOfPreviousPeriod = new Date(now.getFullYear() - 1, 0, 1);
        endOfPreviousPeriod = new Date(now.getFullYear() - 1, 11, 31);
        endOfPreviousPeriod.setHours(23, 59, 59, 999);
        break;

      default:
        throw new BadRequestException('Invalid parameter');
    }

    const totalTransactionCurrent = await this.transactionModel.find({
      createdAt: { $gte: startOfPeriod, $lte: endOfPeriod },
    });
    let totalIncomeCurrent = 0;
    totalTransactionCurrent.forEach(
      (transaction) => (totalIncomeCurrent += transaction.amount),
    );

    const totalTransactionPrevious = await this.transactionModel.find({
      createdAt: { $gte: startOfPreviousPeriod, $lte: endOfPreviousPeriod },
    });
    let totalIncomePrevious = 0;
    totalTransactionPrevious.forEach(
      (transaction) => (totalIncomePrevious += transaction.amount),
    );

    const totalCourseCurrent = await this.courseModel.find({
      createdAt: { $gte: startOfPeriod, $lte: endOfPeriod },
    });

    const totalCoursePrevious = await this.courseModel.find({
      createdAt: { $gte: startOfPreviousPeriod, $lte: endOfPreviousPeriod },
    });

    const totalNewUserCurrent = await this.userModel.find({
      createdAt: { $gte: startOfPeriod, $lte: endOfPeriod },
    });

    const totalNewUserPrevious = await this.userModel.find({
      createdAt: { $gte: startOfPreviousPeriod, $lte: endOfPreviousPeriod },
    });

    const incomeDifferencePercent =
      totalIncomePrevious !== 0
        ? ((totalIncomeCurrent - totalIncomePrevious) / totalIncomePrevious) *
          100
        : totalIncomeCurrent !== 0
          ? 100
          : 0;
    const courseDifferencePercent =
      totalCoursePrevious.length !== 0
        ? ((totalCourseCurrent.length - totalCoursePrevious.length) /
            totalCoursePrevious.length) *
          100
        : totalCourseCurrent.length !== 0
          ? 100
          : 0;
    const newUserDifferencePercent =
      totalNewUserPrevious.length !== 0
        ? ((totalNewUserCurrent.length - totalNewUserPrevious.length) /
            totalNewUserPrevious.length) *
          100
        : totalNewUserCurrent.length !== 0
          ? 100
          : 0;

    return {
      income: {
        totalIncomeCurrent,
        totalIncomePrevious,
        differencePercent: incomeDifferencePercent,
      },
      courses: {
        totalCoursesCurrent: totalCourseCurrent.length,
        totalCoursesPrevious: totalCoursePrevious.length,
        differencePercent: courseDifferencePercent,
      },
      newUsers: {
        totalNewUsersCurrent: totalNewUserCurrent.length,
        totalNewUsersPrevious: totalNewUserPrevious.length,
        differencePercent: newUserDifferencePercent,
      },
    };
  }

  async statisticTopService(): Promise<any> {
    const allCourses = await this.courseModel.find();
    const allSchedule = await this.doctorScheduleModel.find();
    const onlineSchedule = allSchedule.filter(
      (schedule) =>
        schedule.examination_form != null &&
        schedule.examination_form === ScheduleExaminationFormEnum.ONLINE,
    );
    const offlineSchedule = allSchedule.filter(
      (schedule) =>
        schedule.examination_form != null &&
        schedule.examination_form === ScheduleExaminationFormEnum.OFFLINE,
    );
    const total =
      allCourses.length + onlineSchedule.length + offlineSchedule.length;
    return [
      {
        name: 'Đặt lịch online',
        popularity: (onlineSchedule.length / total) * 100,
        color: '#1299fa',
      },
      {
        name: 'Đặt lịch offline',
        popularity: (offlineSchedule.length / total) * 100,
        color: '#26dfa0',
      },
      {
        name: 'Mua khóa học',
        popularity: (allCourses.length / total) * 100,
        color: '#8554e6',
      },
    ];
  }

  async statisticRevenueForMonth(): Promise<any> {
    const allTransaction = await this.transactionModel.find();
    const allTransactionOf9 = allTransaction.filter(
      (transaction) => transaction.createdAt.getMonth() === 8,
    );
    const revenueOf9 = allTransactionOf9.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const allTransactionOf10 = allTransaction.filter(
      (transaction) => transaction.createdAt.getMonth() === 9,
    );
    const revenueOf10 = allTransactionOf10.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const allTransactionOf11 = allTransaction.filter(
      (transaction) => transaction.createdAt.getMonth() === 10,
    );
    const revenueOf11 = allTransactionOf11.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    const allTransactionOf12 = allTransaction.filter(
      (transaction) => transaction.createdAt.getMonth() === 11,
    );
    const revenueOf12 = allTransactionOf12.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    return [revenueOf9, revenueOf10, revenueOf11, revenueOf12];
  }

  async statisticRevenueForCurrentWeek(): Promise<any> {
    const allTransaction = await this.transactionModel.find();

    function getMondayOfWeek(date: Date): Date {
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(date);
      monday.setDate(monday.getDate() + diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    }

    const startOfCurrentWeek = getMondayOfWeek(new Date());
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dayOfWeekRevenuePayProduct = Array(7).fill(0);
    const dayOfWeekRevenuePaySchedule = Array(7).fill(0);

    allTransaction.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      transactionDate.setHours(0, 0, 0, 0);

      const dayOffset = Math.floor(
        (transactionDate.getTime() - startOfCurrentWeek.getTime()) /
          (24 * 60 * 60 * 1000),
      );

      if (dayOffset >= 0 && transactionDate <= currentDate) {
        if (transaction.transaction_type === TransactionTypeEnum.PAY) {
          dayOfWeekRevenuePayProduct[dayOffset] += transaction.amount;
        } else if (
          transaction.transaction_type === TransactionTypeEnum.SCHEDULE
        ) {
          dayOfWeekRevenuePaySchedule[dayOffset] += transaction.amount;
        }
      }
    });

    return { dayOfWeekRevenuePayProduct, dayOfWeekRevenuePaySchedule };
  }

  async statisticDomainForMonth(): Promise<any> {
    const domain = await this.domainModel.findOne();
    const listVisit = [0, 0, 0, 0];
    const listPodcast = [0, 0, 0, 0];
    const listSurvey = [0, 0, 0, 0];

    const months = [domain.Sep, domain.Oct, domain.Nov, domain.Dec];

    months.forEach((monthData, index) => {
      monthData.forEach((item) => {
        switch (item.type) {
          case DomainEnum.VISIT:
            listVisit[index] = item.quantity;
            break;
          case DomainEnum.MUSIC:
          case DomainEnum.PODCAST:
            listPodcast[index] += item.quantity;
            break;
          case DomainEnum.SURVEY:
            listSurvey[index] = item.quantity;
            break;
        }
      });
    });

    return {
      visit: listVisit,
      podcast: listPodcast,
      survey: listSurvey,
    };
  }
}
