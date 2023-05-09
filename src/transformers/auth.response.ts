import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserEntity {
  _id: ObjectId;
  firstname: string;
  lastname: string;
  otp: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}