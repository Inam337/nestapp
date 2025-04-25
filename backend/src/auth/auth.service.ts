import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
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
    try {
      console.log('Starting registration process for:', email);

      // Check for existing user
      const existing = await this.userRepo.findOne({ where: { email } });
      if (existing) {
        console.log('Email already exists:', email);
        throw new ConflictException('Email already registered');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      console.log('Password hashed successfully');

      // Create user entity
      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
      });
      console.log('User entity created:', { name, email });

      // Save user to database
      const savedUser = await this.userRepo.save(user);
      console.log('User saved successfully:', {
        id: savedUser.id,
        email: savedUser.email,
      });

      // Generate JWT token
      const token = this.jwtService.sign({
        userId: savedUser.id,
        email: savedUser.email,
      });

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
        },
        token,
      };
    } catch (error) {
      console.error('Error in register service:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('Login attempt for email:', email);

      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        console.log('User not found with email:', email);
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        throw new UnauthorizedException('Invalid email or password');
      }

      // Check if user is inactive
      if (user.status === false) {
        console.log('Login attempt by inactive user:', email);
        throw new UnauthorizedException('User is inactive');
      }

      const token = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });

      console.log('Login successful for user:', email);
      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      console.error('Error in login service:', error);
      throw error;
    }
  }
}
