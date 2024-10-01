import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name)
    private readonly sectionModel: Model<Section>,
  ) {}

  // Create a new section
  async createSection(createSectionDto: CreateSectionDto): Promise<Section> {
    const newSection = new this.sectionModel(createSectionDto);
    return await newSection.save();
  }

  // Get all sections
  async getAllSections(): Promise<Section[]> {
    return await this.sectionModel.find().populate('question_list_id').exec();
  }

  // Get a section by ID
  async getSectionById(sectionId: string): Promise<Section> {
    const section = await this.sectionModel
      .findById(sectionId)
      .populate('question_list_id')
      .exec();
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    return section;
  }

  // Update a section by ID
  async updateSection(
    sectionId: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const updatedSection = await this.sectionModel
      .findByIdAndUpdate(sectionId, updateSectionDto, { new: true })
      .exec();
    if (!updatedSection) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    return updatedSection;
  }

  // Delete a section by ID
  async deleteSection(sectionId: string): Promise<string> {
    const result = await this.sectionModel.findByIdAndDelete(sectionId).exec();
    if (!result) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    return `Section with ID ${sectionId} deleted`;
  }
}
