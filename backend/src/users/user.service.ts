import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(userDto: CreateUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: userDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const newUser = this.userRepo.create(userDto);
    return await this.userRepo.save(newUser);
  }

  async update(id: number, data: Partial<Users>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    return this.userRepo.save(user);
  }
  async delete(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not Found');
    }
    return { message: 'User Deleted' };
  }
}
