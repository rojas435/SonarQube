import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../accounts/user/entities/user.entity';
import { PasswordService } from '../utils/password.utils';
import { UserService } from 'src/accounts/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,  // Inyecta el servicio de hashing
  ) {}

  /**
   * Validate a user's credentials during login.
   * @param email - The user's email.
   * @param password - The plain text password.
   * @returns The user if credentials are valid, null otherwise.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.passwordService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  async login(email: string, password: string): Promise<{ user: any, token: string}> {
    const user = await this.userService.findByEmail(email);
    if(!user){
        throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    console.log('Token generado:', token);
    console.log('Payload del token:', { id: user.id, email: user.email, role: user.role });

    return{
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.role,
        },
        token: token
    };
  }
}