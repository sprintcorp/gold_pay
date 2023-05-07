import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException, BadRequestException, MethodNotAllowedException, NotFoundException
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.EXPECTATION_FAILED;

    /**
     * @description Exception json transformers
     * @param message
     */
    const responseMessage = (type, message, statusCode= status) => {
      response.status(statusCode).json({
        statusCode: statusCode,
        path: request.url,
        errorType: type,
        errorMessage: message.message?message.message:message
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if(exception['code'] === 11000){
      responseMessage("Error",
        Object.keys(exception['keyValue'])+' '+Object.values(exception['keyValue'])+' already exist',
        HttpStatus.NOT_ACCEPTABLE);
    } else if(exception instanceof BadRequestException){
      responseMessage(exception.name, exception.getResponse(), HttpStatus.BAD_REQUEST);
    }else if(exception instanceof NotFoundException){
      console.log(exception)
      responseMessage(exception.name, exception.getResponse(), HttpStatus.METHOD_NOT_ALLOWED);
    } else if(exception instanceof TypeError){
      responseMessage(exception.name, exception.message, HttpStatus.METHOD_NOT_ALLOWED)
    }else {
      console.log(exception)
      responseMessage(exception.name, exception.getResponse());
    }
  }
}
