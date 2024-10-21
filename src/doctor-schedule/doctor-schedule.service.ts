import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DoctorSchedule,
  DoctorScheduleDocument,
} from './entities/doctor-schedule.entity';
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { RoleEnum } from 'src/role/enum/role.enum';
import { DoctorScheduleStatus } from './enum/doctor-schedule-status.enum';
import {
  ScheduleSlotEnum,
  TimeOfSlotInSchedule,
} from './enum/schedule-slot.enum';
import * as moment from 'moment';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectModel(DoctorSchedule.name)
    private readonly doctorScheduleModel: Model<DoctorScheduleDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly emailService: EmailService,
  ) {}

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

  //Chỉ tạo trước 2h
  async createNewDoctorSchedule(
    createDoctorScheduleDto: CreateDoctorScheduleDto,
    customer: any,
  ): Promise<DoctorSchedule> {
    const now = moment(new Date());
    const scheduleDate = moment(createDoctorScheduleDto.appointment_date);

    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(createDoctorScheduleDto.slot))
      .split('-')[1];

    const [scheduleHour, scheduleMinute] = scheduleTime.split('h').map(Number);

    const scheduleDateTime = scheduleDate.clone().set({
      hour: scheduleHour,
      minute: scheduleMinute,
      second: 0,
      millisecond: 0,
    });

    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      scheduleDateTime.diff(now, 'hours', true) < 2
    ) {
      throw new BadRequestException(
        'Slot must be greater than the current time by at least 2 hours',
      );
    }

    const doctor = await this.userModel
      .findById(createDoctorScheduleDto.doctor_id)
      .exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const checkExistSchedule = await this.doctorScheduleModel.findOne({
      doctor_id: doctor._id,
      appointment_date: createDoctorScheduleDto.appointment_date,
      slot: createDoctorScheduleDto.slot,
    });
    if (checkExistSchedule) {
      throw new BadRequestException('This slot already booked!');
    }
    const newDoctorSchedule = new this.doctorScheduleModel(
      createDoctorScheduleDto,
    );
    newDoctorSchedule.customer_id = customer._id;
    newDoctorSchedule.status = DoctorScheduleStatus.PENDING;

    //Send mail for customer
    const appointment_date_email = moment(
      createDoctorScheduleDto.appointment_date,
    ).format('DD-MM-YYYY');
    const scheduleTimeaa = this.timeOfSlot
      .find((s) => s.includes(createDoctorScheduleDto.slot))
      .split('-')[1];
    const slot_email = `${
      Number.parseInt(scheduleTimeaa) >= 12
        ? `${Number.parseInt(scheduleTimeaa)}h30`
        : `${Number.parseInt(scheduleTimeaa)}h`
    }-${
      Number.parseInt(scheduleTimeaa) >= 12
        ? `${Number.parseInt(scheduleTimeaa) + 1}h30`
        : `${Number.parseInt(scheduleTimeaa) + 1}h`
    }`;
    await this.emailService.sendMailWhenScheduleSuccess(
      customer.email,
      customer.fullname,
      appointment_date_email,
      slot_email,
      doctor.fullname,
    );

    return await newDoctorSchedule.save();
  }

  async findAllScheduleOfDoctor(doctor: any): Promise<DoctorSchedule[]> {
    const doctorSchedules = await this.doctorScheduleModel
      .find({ doctor_id: doctor._id })
      .populate('customer_id');
    if (!doctorSchedules) {
      throw new InternalServerErrorException(
        'Something when wrong when retrieving all schedules of doctor',
      );
    }
    return doctorSchedules;
  }

  async findAllScheduleOfCustomer(customer: any): Promise<DoctorSchedule[]> {
    const customerSchedules = await this.doctorScheduleModel
      .find({ customer_id: customer._id })
      .populate('doctor_id');
    if (!customerSchedules) {
      throw new InternalServerErrorException(
        'Something when wrong when retrieving all schedules of doctor',
      );
    }
    return customerSchedules;
  }

  //Admin only
  async findAllScheduleOfUser(user_id: string): Promise<DoctorSchedule[]> {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role_name === RoleEnum.CUSTOMER) {
      const customerSchedules = await this.doctorScheduleModel
        .find({ customer_id: user_id })
        .populate('customer_id doctor_id');
      if (!customerSchedules) {
        throw new InternalServerErrorException(
          'Something when wrong when retrieving all schedules of doctor',
        );
      }
      return customerSchedules;
    } else {
      const doctorSchedules = await this.doctorScheduleModel
        .find({ doctor_id: user_id })
        .populate('customer_id doctor_id');
      if (!doctorSchedules) {
        throw new InternalServerErrorException(
          'Something when wrong when retrieving all schedules of doctor',
        );
      }
      return doctorSchedules;
    }
  }

  async findDoctorScheduleById(id: string): Promise<DoctorSchedule> {
    const doctorSchedule = await this.doctorScheduleModel
      .findById(id)
      .populate('customer_id doctor_id')
      .exec();
    if (!doctorSchedule) {
      throw new NotFoundException(`DoctorSchedule not found`);
    }
    return doctorSchedule;
  }

  async getAllFreeSlotOfDoctorOfDate(
    date: Date,
    doctor_id: string,
  ): Promise<ScheduleSlotEnum[]> {
    const doctorScheduleOnDate = await this.doctorScheduleModel.find({
      doctor_id,
      appointment_date: date,
      status: DoctorScheduleStatus.PENDING,
    });

    if (!doctorScheduleOnDate) {
      throw new InternalServerErrorException(
        'Something went wrong when retrieving schedule slots for doctor',
      );
    }

    if (doctorScheduleOnDate.length === 0) {
      return this.slotOfDate;
    } else {
      const listSlotExistSchedule = [];
      doctorScheduleOnDate.forEach((schedule) => {
        if (!listSlotExistSchedule.includes(schedule.slot)) {
          listSlotExistSchedule.push(schedule.slot);
        }
      });
      const result = this.slotOfDate.filter(
        (item) => !listSlotExistSchedule.includes(item),
      );
      return result;
    }
  }

  async customerCancelSchedule(
    id: string,
    customer: any,
  ): Promise<DoctorSchedule> {
    const schedule = await this.doctorScheduleModel
      .findOne({ customer_id: customer._id, _id: id })
      .exec();

    if (!schedule) {
      throw new NotFoundException(`DoctorSchedule not found`);
    }

    const now = moment(new Date());
    const scheduleDate = moment(schedule.appointment_date);
    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(schedule.slot))
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() < 2
    ) {
      throw new BadRequestException(
        'Schedule must be cancel before 2 hours from appointment time',
      );
    }

    const updatedDoctorSchedule = await this.doctorScheduleModel
      .findByIdAndUpdate(
        id,
        { status: DoctorScheduleStatus.CANCELED },
        { new: true },
      )
      .exec();

    return updatedDoctorSchedule;
  }

  async doctorCompleteSchedule(
    id: string,
    doctor: any,
  ): Promise<DoctorSchedule> {
    const schedule = await this.doctorScheduleModel
      .findOne({ doctor_id: doctor._id, _id: id })
      .exec();

    if (!schedule) {
      throw new NotFoundException(`DoctorSchedule not found`);
    }

    const now = moment(new Date());
    const scheduleDate = moment(schedule.appointment_date);
    const scheduleTime = this.timeOfSlot
      .find((slot) => slot.includes(schedule.slot))
      .split('-')[1];
    if (
      scheduleDate.clone().startOf('day').isAfter(now.clone().startOf('day'))
    ) {
      throw new BadRequestException(
        'Doctor only completed schedule after meeting with customer',
      );
    }
    if (
      scheduleDate.clone().startOf('day').isSame(now.clone().startOf('day')) &&
      Number.parseInt(scheduleTime) - now.hour() > 0
    ) {
      throw new BadRequestException(
        'Doctor only completed schedule after meeting with customer',
      );
    }

    const updatedDoctorSchedule = await this.doctorScheduleModel
      .findByIdAndUpdate(
        id,
        { status: DoctorScheduleStatus.COMPLETED },
        { new: true },
      )
      .exec();

    return updatedDoctorSchedule;
  }

  async doctorCheckExaminedSchedule(
    id: string,
    doctor: any,
  ): Promise<DoctorSchedule> {
    const schedule = await this.doctorScheduleModel
      .findOne({ doctor_id: doctor._id, _id: id })
      .exec();

    if (!schedule) {
      throw new NotFoundException(`DoctorSchedule not found`);
    }

    schedule.examined_session += 1;
    await schedule.save();

    return schedule;
  }

  //Admin Only
  async removeDoctorSchedule(id: string): Promise<string> {
    const result = await this.doctorScheduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`DoctorSchedule with id ${id} not found`);
    }
    return 'Schedule deleted successfully';
  }
}
