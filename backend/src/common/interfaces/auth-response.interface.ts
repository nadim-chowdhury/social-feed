import { User } from '../../users/entities/user.entity';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}
