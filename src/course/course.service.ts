import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: any,
  ): Promise<Course> {
    const { product_type } = createCourseDto;

    const existingCourse = await this.courseModel.findOne({
      product_type,
      user_id: user._id,
    });
    if (existingCourse) {
      throw new BadGatewayException('Bạn đã mua khóa học này!');
    }

    const createdCourse = new this.courseModel(createCourseDto);
    createdCourse.user_id = user._id;
    return await createdCourse.save();
  }

  async getAllCourseOfUser(user: any): Promise<Course[]> {
    return this.courseModel.find({ user_id: user._id }).exec();
  }

  // Find course by ID
  async getCourseOfUserById(id: string, user: any): Promise<Course> {
    const course = await this.courseModel.findOne({
      _id: id,
      user_id: user._id,
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async getAllCourseForAdmin(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async getAllCourseOfUserForAdmin(user_id: string): Promise<Course[]> {
    return this.courseModel.find({ user_id }).exec();
  }

  async deleteCourseByID(id: string): Promise<string> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return `Course with ID "${id}" deleted`;
  }

  async deleteAllCourseByAdmin(): Promise<string> {
    await this.courseModel.deleteMany().exec();
    return `All Course deleted`;
  }
}
