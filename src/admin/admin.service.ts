import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from 'src/blog/entities/blog.entity';
import { Course } from 'src/course/entities/course.entity';
import { DoctorSchedule } from 'src/doctor-schedule/entities/doctor-schedule.entity';
import { ScheduleExaminationFormEnum } from 'src/doctor-schedule/enum/examination-form.enum';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { PodcastCategoryEnum } from 'src/podcast/enum/podcast-category.enum';
import { Survey } from 'src/survey/entities/survey.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
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

  async statisticDateSales(): Promise<any> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );
    const endOfYesterday = new Date(
      startOfYesterday.getTime() + 24 * 60 * 60 * 1000 - 1,
    );

    const totalTransactionToday = await this.transactionModel.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    let totalIncomeToday = 0;
    totalTransactionToday.forEach(
      (transaction) => (totalIncomeToday += transaction.amount),
    );

    const totalTransactionYesterday = await this.transactionModel.find({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    });
    let totalIncomeYesterday = 0;
    totalTransactionYesterday.forEach(
      (transaction) => (totalIncomeYesterday += transaction.amount),
    );

    const totalCourseToday = await this.courseModel.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const totalCourseYesterday = await this.courseModel.find({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    });

    const totalNewUserToday = await this.userModel.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const totalNewUserYesterday = await this.userModel.find({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    });

    const incomeDifferencePercent =
      totalIncomeYesterday !== 0
        ? ((totalIncomeToday - totalIncomeYesterday) / totalIncomeYesterday) *
          100
        : totalIncomeToday !== 0
          ? 100
          : 0;
    const courseDifferencePercent =
      totalCourseYesterday.length !== 0
        ? ((totalCourseToday.length - totalCourseYesterday.length) /
            totalCourseYesterday.length) *
          100
        : totalCourseToday.length !== 0
          ? 100
          : 0;
    const newUserDifferencePercent =
      totalNewUserYesterday.length !== 0
        ? ((totalNewUserToday.length - totalNewUserYesterday.length) /
            totalNewUserYesterday.length) *
          100
        : totalNewUserToday.length !== 0
          ? 100
          : 0;

    return {
      income: {
        totalIncomeToday,
        totalIncomeYesterday,
        differencePercent: incomeDifferencePercent,
      },
      courses: {
        totalCoursesToday: totalCourseToday.length,
        totalCoursesYesterday: totalCourseYesterday.length,
        differencePercent: courseDifferencePercent,
      },
      newUsers: {
        totalNewUsersToday: totalNewUserToday.length,
        totalNewUsersYesterday: totalNewUserYesterday.length,
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

  async statisticRevenueForCurrentWeek(): Promise<number[]> {
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

    const dailyRevenue = Array(7).fill(0);

    allTransaction.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      transactionDate.setHours(0, 0, 0, 0);

      const dayOffset = Math.floor(
        (transactionDate.getTime() - startOfCurrentWeek.getTime()) /
          (24 * 60 * 60 * 1000),
      );

      if (dayOffset >= 0 && transactionDate <= currentDate) {
        dailyRevenue[dayOffset] += transaction.amount;
      }
    });

    return dailyRevenue;
  }
}
