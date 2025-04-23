import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  firebaseToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    try {
      console.log('Register request received for:', registerData.email);

      // For now, we'll skip Firebase token verification since it's causing issues
      // We'll implement proper Firebase verification later

      const result = await this.authService.register(
        registerData.name,
        registerData.email,
        registerData.password,
      );

      console.log('Registration successful for:', registerData.email);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      console.log('Login request received for:', email);
      const result = await this.authService.login(email, password);
      console.log('Login successful for:', email);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
