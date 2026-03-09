import { Role } from '../../../generated/prisma/enums';

export type AuthJwtPayload = {
  email: string;
  sub: string;
  role: Role;
};
