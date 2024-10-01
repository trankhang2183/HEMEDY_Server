import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name)
    private readonly surveyModel: Model<Survey>,
  ) {}

  // Create a new survey
  async createSurvey(createSurveyDto: CreateSurveyDto): Promise<Survey> {
    const newSurvey = new this.surveyModel(createSurveyDto);
    return await newSurvey.save();
  }

  // Get all surveys
  async getAllSurveys(): Promise<Survey[]> {
    return await this.surveyModel.find().populate('section_list_id').exec();
  }

  // Get a survey by ID
  async getSurveyById(surveyId: string): Promise<Survey> {
    const survey = await this.surveyModel
      .findById(surveyId)
      .populate('section_list_id')
      .exec();
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found`);
    }
    return survey;
  }

  // Update a survey by ID
  async updateSurvey(
    surveyId: string,
    updateSurveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    const updatedSurvey = await this.surveyModel
      .findByIdAndUpdate(surveyId, updateSurveyDto, { new: true })
      .exec();
    if (!updatedSurvey) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found`);
    }
    return updatedSurvey;
  }

  // Delete a survey by ID
  async deleteSurvey(surveyId: string): Promise<string> {
    const result = await this.surveyModel.findByIdAndDelete(surveyId).exec();
    if (!result) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found`);
    }
    return `Survey with ID ${surveyId} deleted`;
  }
}
