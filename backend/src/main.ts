import { NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as cookieParser from "cookie-parser"
import { AuthService } from "./auth/auth.service"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const authService = app.get(AuthService)
  const configService = app.get(ConfigService)

  const frontendUrl = configService.get<string>("FRONTEND_URL")

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.use(cookieParser())

  // Nettoyer les tokens expirés toutes les minutes
  setInterval(
    () => {
      authService.cleanupExpiredTokens()
    },
    60 * 1000, // Toutes les minutes au lieu de 5 minutes
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
