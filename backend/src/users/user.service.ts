import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  create(user: Partial<Users>) {
    console.log('User', user);
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser); // <- this can throw if invalid
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
