import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { MikroOrmModule } from "@mikro-orm/nestjs"

import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"

import { JwtStrategy } from "./jwt.strategy"
import { JwtAuthGuard } from "./jwt-auth.guard"

import { UserModule } from "../user/user.module"
import { User } from "../user/user.entity"

import { EmailModule } from "src/emails/email.module"

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MikroOrmModule.forFeature({ entities: [User] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: { expiresIn: "15m" },
    }),
    UserModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
