import { Module } from '@nestjs/common';
import { TradeGroupService } from '@octoco/shared';
import { TradeGroupController } from '../controllers/trade-group.controller';

@Module({
  controllers: [TradeGroupController],
  providers: [TradeGroupService],
})
export class TradeGroupModule {}
