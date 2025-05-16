import { Module } from "@nestjs/common"
import { EmailController } from "./email.controller"
import { MailService } from "./email.service"
import { forwardRef } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"

import { MikroOrmModule } from "@mikro-orm/nestjs"
import { MagicLinkToken } from "./email.token.entity"

@Module({
  imports: [MikroOrmModule.forFeature([MagicLinkToken]), forwardRef(() => AuthModule)],
  controllers: [EmailController],
  providers: [MailService],
  exports: [MailService],
})
export class EmailModule {}
