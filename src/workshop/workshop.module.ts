import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workshop, WorkshopSchema } from './entities/workshop.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workshop.name, schema: WorkshopSchema },
    ]),
  ],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class WorkshopModule {}
