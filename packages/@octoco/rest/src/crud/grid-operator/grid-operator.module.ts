import { Module } from '@nestjs/common';
import { GridOperatorController } from './grid-operator.controller.js';
import { GridOperatorService } from '@octoco/models';

@Module({
  controllers: [GridOperatorController],
  providers: [GridOperatorService],
})
export class GridOperatorModule {}
