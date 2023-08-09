import { Module } from '@nestjs/common';
import { TradeGroupService } from '@octoco/models';
import { TradeGroupController } from './trade-group.controller.js';

@Module({
  controllers: [TradeGroupController],
  providers: [TradeGroupService],
})
export class TradeGroupModule {}
