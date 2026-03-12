import { Expose } from 'class-transformer';
import { Role } from '../../../generated/prisma/enums';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  role!: Role;

  @Expose()
  createdAt!: Date;
}
