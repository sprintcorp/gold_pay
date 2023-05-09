import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class TokenDto{

  @MinLength(0)
  @IsNotEmpty()
  user: string;

	@IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  transactionPin: number;

	@MaxLength(50)
  @MinLength(2)
  amount: number;
}