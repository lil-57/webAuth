import { type ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()

    if (!req.headers["authorization"]) {
      const token = req.cookies?.["access_token"]
      if (token) {
        req.headers["authorization"] = `Bearer ${token}`
      }
    }
    return req
  }

  canActivate(context: ExecutionContext) {
    console.log("🛡️ JwtAuthGuard activé")
    return super.canActivate(context)
  }
}
