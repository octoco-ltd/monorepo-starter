import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's email address.",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "The user's authorisation roles.",
  })
  roles: string[];
}
