import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { PaymentDTO, WithdrawDTO } from "src/dto/payment.dto";
import { PaymentListDTO, PaymentListUpdateDTO } from "src/dto/paymentList.dto";
import { PaymentService } from "src/services/payment.service";
import { Roles } from "src/utils/roles.decorator";
import { UserRoles } from "src/utils/roles.utils";
import { AuthGuard } from "../guards/auth.guard";

@Controller('/api/v1/')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}



  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Post('admin/payment-list')
  async createPaymentList(@Res() res, @Req() req, @Body() paymentList: PaymentListDTO): Promise<any>{
      const data = await this.paymentService.createPaymentList(paymentList);
      return res.status(HttpStatus.CREATED).json(data);
  }
  
  
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Get('admin/payment-request')
  async userPaymentRequest(@Res() res): Promise<any>{
      const data = await this.paymentService.userPaymentRequest();
      return res.status(HttpStatus.OK).json(data);
  }
  
  
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Get('admin/payment-request/:id')
  async userPaymentRequestDetails(@Res() res, @Param('id') id): Promise<any>{
      const data = await this.paymentService.userPaymentRequestDetails(id);
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Get('payment-list/:id')
  async paymentList(@Res() res, @Param('id') id, @Req() req): Promise<any>{
      const data = await this.paymentService.paymentList(id, req.user.role);
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Get('payment-list')
  async getPaymentList(@Res() res): Promise<any>{
      const data = await this.paymentService.getPaymentList();
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Put('admin/payment-list/:id')
  async updatePaymentList(@Res() res, @Param('id') id, @Body() paymentList: PaymentListUpdateDTO): Promise<any>{
      const data = await this.paymentService.updatePaymentList(paymentList, id);
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Delete('admin/payment-list/:id')
  async deletePaymentList(@Res() res, @Param('id') id): Promise<any>{
      const data = await this.paymentService.deletePaymentList(id);
      return res.status(HttpStatus.OK).json(data);
  }


  @UseGuards(AuthGuard)
  @Post('user/deposit')
  async p2pDeposit(@Res() res, @Body() payment: PaymentDTO, @Req() request): Promise<any>{
    const data = await this.paymentService.depositRequest(payment, request);
      return res.status(HttpStatus.CREATED).json(data);
  }

  @UseGuards(AuthGuard)
  @Get('user/payment-requests-history')
  async getUserPaymentRequest(@Res() res, @Req() request): Promise<any>{
      const data = await this.paymentService.paymentHistory(request);
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Put('user/payment-confrim/:id')
  async confrimDeposit(@Res() res, @Param('id') id): Promise<any>{
      const data = await this.paymentService.confrimPayment(id);
      return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Put('admin/payment-confirm/:id')
  async adminConfrimDeposit(@Res() res, @Param('id') id): Promise<any>{
      const data = await this.paymentService.adminConfirmPayment(id);
      return res.status(HttpStatus.OK).json(data);
  }


  @UseGuards(AuthGuard)
  @Post('user/withdraw')
  async p2pWithdraw(@Res() res, @Body() payment: WithdrawDTO, @Req() request){
    const data = await this.paymentService.withdrawRequest(payment, request);
    return res.status(HttpStatus.OK).json(data);
  }
}