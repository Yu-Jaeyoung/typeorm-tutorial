import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // @PrimaryColumn() -> primary 로 설정. 직접 값을 넣어줘야함
  // @PrimaryGeneratedColumn() -> 순서대로 위로 올라감
  // 자동으로 id를 생성
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    // 자동으로 유추
    type: 'varchar',

    // 자동으로 유추
    name: 'title',

    // 값의 길이
    length: 300,

    nullable: true,
    update: true,

    // find() 를 실행할 때 기본으로 값을 불러올지
    // 기본값이 true
    select: false,

    // 기본 값 설정
    default: 'default value',

    // 컬럼 중에서 유일무이한 값이 되어야하는지
    // 기본 값은 false
    unique: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // 데이터 생성되는 날짜와 시간이 자동으로 찍힘
  @CreateDateColumn()
  createdAt: Date;

  // 데이터가 업데이트되는 날짜와 시간이 자동으로 찍힘
  @UpdateDateColumn()
  updatedAt: Date;

  // save() 함수가 호출된 횟수를 기억 -> 데이터가 업데이트 될 때마다 1씩 올라감
  // 처음 생성되면 값은 1
  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: number;
}
