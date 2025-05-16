import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common"
import  { Reflector } from "@nestjs/core"
import  { RequestWithUser } from "./types/request-with-user"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    console.log("🔒 RolesGuard - user:", user)
    console.log("🔒 RolesGuard - required:", requiredRoles)

    return user && user.role && requiredRoles.includes(user.role)
  }
}
