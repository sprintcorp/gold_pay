import { IsEnum, IsNotEmpty, MaxLength, MinLength, NotEquals } from "class-validator";
import { PaymentList } from "src/models/paymentList.schema";
import { User } from "src/models/user.schema";
import { PaymentType } from "src/utils/helper";

export class PaymentDTO{
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    public amount: number;
  
    @MaxLength(50)
    @MinLength(7)
    @IsEnum(PaymentType)
    @NotEquals(PaymentType.WITHDRAW)
    @IsNotEmpty()
    public type: PaymentType;

    public user:User;

    @IsNotEmpty()
    public paymentList:PaymentList;

  }

  export class WithdrawDTO{
    @MaxLength(50)
    @MinLength(2)
    @IsNotEmpty()
    public amount: number;
  
    @MaxLength(50)
    @MinLength(7)
    @IsEnum(PaymentType)
    @NotEquals(PaymentType.DEPOSIT)
    @IsNotEmpty()
    public type: PaymentType;

    @MaxLength(6)
    @MinLength(6)
    @IsNotEmpty()
    public transaction_pin: number;

    public status: string;

    public user:User;

  }