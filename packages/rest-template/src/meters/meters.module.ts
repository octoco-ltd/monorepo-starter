import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { MeterService } from './meters.service';
import { MeterController } from './meters.controller';

@Module({
  imports: [DbModule],
  providers: [MeterService],
  controllers: [MeterController],
})
export class MeterModule {}
