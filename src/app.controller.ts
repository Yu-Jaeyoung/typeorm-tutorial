import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { ILike, LessThan, Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // 아닌 경우 가져오기
        // id: Not(1),
        // 적은 경우 가져오기
        // 작은 경우 or 같은 경우
        // id: LessThan(30),
        // id: LessThanOrEqual(30),
        // id: MoreThan(30),
        // id: MoreThanOrEqual(30),
        // id: Equal(30),
        // 유사값
        // email: Like('%google%'),
        // 대문자 소문자 구분 안하는 유사값
        // email: ILike('%google%'),
        // 사이값
        // id: Between(10, 15),
        // 해당되는 여러 값
        // id: In([1, 3, 5, 7, 99]),
      },

      // 어떤 프로퍼티를 선택할지 결정
      // 기본은 모든 프로퍼티를 가져옴
      // select 을 정의하면 정의된 프로퍼티들만 가져옴
      // select: {
      //   id: true,
      //   updatedAt: true,
      //   createdAt: true,
      //   version: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // 필터링할 조건을 입력
      // 배열에 넣으면 or 조건으로 동작
      // 객체 안에 넣으면 and 조건으로 동작
      // where: [
      //   {
      //     version: 2,
      //   },
      //   {
      //     id: 6,
      //   },
      //   {
      //     profile: {
      //       id: 3,
      //     },
      //   },
      // ],
      // 관계를 가져오는 법
      // relations: {
      //   profile: true,
      // },
      // 오름차순, 내림차순
      // order: {
      //   id: 'DESC',
      // },
      // 처음 몇 개 제외
      // skip: 1,
      // 처음 몇 개만 가져옴
      // take: 1,
    });
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: 'test@wisoft.io',
    // });

    // 저장
    // const user2 = await this.userRepository.save({
    //   email: 'test@wisoft.io',
    // });

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저장하지는 않음
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'jaeyoung@wisoft.io',
    // });

    // 삭제하기
    // await this.userRepository.delete(101);

    // 값을 증가시킴
    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // 값을 감소시킴
    // await this.userRepository.decrement(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });

    // 합계
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });

    // 평균
    // const avg = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // min
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });

    // max
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });

    return usersAndCount;
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
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
      email: user.email + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(
    @Param('id')
    id: string,
  ) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'jaeyoung@wisoft.io',
      profile: {
        profileImg: 'jaeyoung.jpg',
      },
    });

    // await this.profileRepository.save({
    //   profileImg: 'jaeyoung.jpg',
    //   user,
    // });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@wisoft.io',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts: [post1],
    });

    const posts3 = await this.postRepository.save({
      title: 'Next.js Lecture',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
