import { NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as cookieParser from "cookie-parser"
import { AuthService } from "./auth/auth.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const authService = app.get(AuthService)

  app.enableCors({
    origin: "http://localhost:5173",
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
