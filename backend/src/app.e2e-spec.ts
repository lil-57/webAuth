import { Test, type TestingModule } from "@nestjs/testing"
import * as request from "supertest"
import { AppModule } from "../src/app.module"

describe("AppController (e2e)", () => {
  let app

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  // Test global du status de l'API
  it("/ (GET) should return a welcome message", async () => {
    const response = await request(app.getHttpServer()).get("/").expect(200)

    expect(response.text).toBe("Hello World!")
  })

  // Test des routes /auth/login et /users
  it("/auth/login (POST) should return an access token", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@mail.com", password: "password" })
      .expect(200)

    expect(response.body).toHaveProperty("access_token")
  })

  it("/users (GET) should return all users", async () => {
    const response = await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", "Bearer <admin_token>") // Remplace par un token valide
      .expect(200)

    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toHaveProperty("id")
    expect(response.body[0]).toHaveProperty("email")
  })

  afterAll(async () => {
    await app.close()
  })
})
