import { IsEnum, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { User } from "src/models/user.schema";

export class PaymentDTO{
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    amount: number;
  
    @MaxLength(50)
    @MinLength(2)
    @IsEnum(['deposit','withdraw'])
    @IsNotEmpty()
    type: ['deposit','withdraw'];

    user:User;

  }