import { Test, type TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app.module"

describe("Main Application Startup (e2e)", () => {
  let app

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it("should start the application successfully", () => {
    expect(app).toBeDefined()
  })

  afterAll(async () => {
    await app.close()
  })
})
