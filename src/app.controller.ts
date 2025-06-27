import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // select: {
      //   id: true,
      //   title: true,
      // },
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({
      // title: 'test title',
      // role: Role.ADMIN,
    });
  }

  @Patch('users/:id')
  async patchUser(
    @Param('id')
    id: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: +id,
      },
    });

    if (!user) {
      return;
    }

    return this.userRepository.save({
      ...user,
      title: user.title + '0',
    });
  }
}
