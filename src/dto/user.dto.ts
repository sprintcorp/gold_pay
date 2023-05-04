import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { Exclude, Expose } from "class-transformer";

export class UserDto{

  @MaxLength(50)
  @MinLength(0)
  @IsOptional()
  public firstname: string;

  @MaxLength(50)
  @MinLength(0)
  @IsOptional()
  public lastname: string;

  @IsOptional()
  @MaxLength(20)
  @MinLength(4)
  public username: string;

  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @MinLength(6)
  public password: string;

  @IsOptional()
  @MinLength(6)
  public old_password: string;

  @IsOptional()
  @MinLength(6)
  public confirm_password: string;

  public user_referral_code: string;

  @MaxLength(8)
  @MinLength(8)
  @IsOptional()
  public referral_code: string;

  @IsOptional()
  @MaxLength(6)
  @MinLength(6)
  public login_pin: number;

  @IsOptional()
  @MaxLength(6)
  @MinLength(6)
  public transaction_pin: number;

  public updatedDate: Date;

}
