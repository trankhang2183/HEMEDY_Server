import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workshop } from './entities/workshop.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectModel(Workshop.name)
    private readonly workshopModel: Model<Workshop>,
  ) {}

  // Create a new workshop
  async createWorkshop(
    createWorkshopDto: CreateWorkshopDto,
  ): Promise<Workshop> {
    const newWorkshop = new this.workshopModel(createWorkshopDto);
    return await newWorkshop.save();
  }

  // Get all workshops
  async getAllWorkshops(): Promise<Workshop[]> {
    return await this.workshopModel.find().exec();
  }

  // Get a workshop by ID
  async getWorkshopById(workshopId: string): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopId).exec();
    if (!workshop) {
      throw new NotFoundException(`Workshop with ID ${workshopId} not found`);
    }
    return workshop;
  }

  // Update a workshop by ID
  async updateWorkshop(
    workshopId: string,
    updateWorkshopDto: UpdateWorkshopDto,
  ): Promise<Workshop> {
    const updatedWorkshop = await this.workshopModel
      .findByIdAndUpdate(workshopId, updateWorkshopDto, { new: true })
      .exec();
    if (!updatedWorkshop) {
      throw new NotFoundException(`Workshop with ID ${workshopId} not found`);
    }
    return updatedWorkshop;
  }

  // Delete a workshop by ID
  async deleteWorkshop(workshopId: string): Promise<string> {
    const result = await this.workshopModel
      .findByIdAndDelete(workshopId)
      .exec();
    if (!result) {
      throw new NotFoundException(`Workshop with ID ${workshopId} not found`);
    }
    return `Workshop with ID ${workshopId} deleted`;
  }
}
