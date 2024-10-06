import { Module } from '@nestjs/common';
import { ConfigResultService } from './config_result.service';
import { ConfigResultController } from './config_result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigResult,
  ConfigResultSchema,
} from './entities/config_result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigResult.name, schema: ConfigResultSchema },
    ]),
  ],
  controllers: [ConfigResultController],
  providers: [ConfigResultService],
})
export class ConfigResultModule {}
