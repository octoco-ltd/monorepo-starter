import { ApiProperty } from '@nestjs/swagger';

/**
 * Type for specifying a time period in fixed numbers of days or months.
 */
export class TimePeriod {
  @ApiProperty()
  public readonly days: number;

  @ApiProperty()
  public readonly months: number;

  constructor(days: number, months: number) {
    this.days = days;
    this.months = months;
  }
}
