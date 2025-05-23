import { Module } from "@nestjs/common"
import { UserModule } from "./user/user.module"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import { AuthModule } from "./auth/auth.module"
import mikroOrmConfig from "../mikro-orm.config"
import { EmailModule } from "./emails/email.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, 
    AuthModule, 
    EmailModule, 
    MikroOrmModule.forRoot(mikroOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
