import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class PaymentListDTO{
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    amount: number;
  
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    name: string;

    @MaxLength(5000)
    @MinLength(10)
    @IsOptional()
    description: string;
  
    @MaxLength(10)
    @MinLength(10)
    @IsNotEmpty()
    accountNumber: number;
  
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    accountName: string;
  
    @MaxLength(50)
    @MinLength(4)
    @IsNotEmpty()
    accountType: string;
  
    @MaxLength(50)
    @MinLength(3)
    @IsNotEmpty()
    bankName: string;
  }



  export class PaymentListUpdateDTO{
    @MaxLength(50)
    @MinLength(2)
    @IsOptional()
    amount: number;
  
    @MaxLength(50)
    @MinLength(2)
    @IsOptional()
    name: string;

    @MaxLength(5000)
    @MinLength(10)
    @IsOptional()
    description: string;
  
    @MaxLength(10)
    @MinLength(10)
    @IsOptional()
    accountNumber: number;
  
    @MaxLength(50)
    @MinLength(2)
    @IsOptional()
    accountName: string;
  
    @MaxLength(50)
    @MinLength(4)
    @IsOptional()
    accountType: string;
  
    @MaxLength(50)
    @MinLength(3)
    @IsOptional()
    bankName: string;
  }