import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async register(name: string, email: string, password: string) {
    console.log('Registering user:', email);

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(password);
    console.log('Password hashed successfully');

    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);
    console.log('User registered successfully:', { email, name });

    return {
      success: true,
      message: 'User registered successfully',
    };
  }

  async login(email: string, password: string) {
    console.log('Login attempt for email:', email);

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      console.log('User not found with email:', email);
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('User found, comparing passwords');

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Plain password:', password);
      console.log('Stored hashed password:', user.password);
      console.log('Password comparison result:', isMatch);

      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('Password matched, generating token');
      const token = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });

      console.log('Login successful for user:', email);
      return {
        success: true,
        message: 'Login successful',
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
