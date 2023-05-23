import { Injectable, CanActivate, ExecutionContext, Req } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/services/auth.service';
import { ROLES_KEY } from './roles.decorator';
import { UserRoles } from './roles.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwt: JwtService, 
    private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    
    const req = context.switchToHttp().getRequest();
    const token = req.rawHeaders[1].split(' ')[1];

    const decoded = await this.jwt.verify(token);

    const user = await this.authService.getOne(decoded.email)

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}