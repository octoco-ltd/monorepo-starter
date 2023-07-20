import { Module } from '@nestjs/common';
import { MeterModule } from './meters/meters.module';

@Module({
  imports: [MeterModule],
})
export class AppModule {}
