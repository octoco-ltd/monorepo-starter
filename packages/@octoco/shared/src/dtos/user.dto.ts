import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's email address.",
    type: String,
  })
  @IsDefined()
  email: string;

  @ApiProperty({
    description: "The user's authorisation roles.",
    type: [String],
  })
  @IsDefined()
  roles: string[];
}
