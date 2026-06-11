import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entity/user.entity';
import { ROLES_KEY } from 'src/auth/guards/roles.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
