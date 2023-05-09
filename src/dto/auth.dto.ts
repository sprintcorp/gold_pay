import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { Exclude, Expose } from "class-transformer";

export class AuthDto{

  @MaxLength(50)
  @MinLength(0)
  @IsOptional()
  public firstname: string;

  @MaxLength(50)
  @MinLength(0)
  @IsOptional()
  public lastname: string;

  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(4)
  public username: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  public user_referral_code: string;

  @MaxLength(8)
  @MinLength(8)
  @IsOptional()
  public referral_code: string;

  public otp: number;

  public address: string

  public private_key: string

  public login_pin: number;

  public transaction_pin: number;

  public active: boolean;

  public createdDate: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

}
