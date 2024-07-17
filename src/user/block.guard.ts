import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class BlockGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    console.log(user);

    if (!user || user.isBlocked) {
      throw new UnauthorizedException(`you're banned from this platform`);
    }

    return true;
  }
}
