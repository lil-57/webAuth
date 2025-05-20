import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { randomUUID } from "crypto"

@Entity()
export class User {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID()

  @Property({ nullable: true })
  firstName?: string

  @Property({ nullable: true })
  lastName?: string

  @Property({ nullable: true })
  password?: string

  @Property({ unique: true })
  email!: string

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date()

  @Property({ default: "user" })
  role: "user" | "admin"

  @Property({ nullable: true })
  refreshToken?: string | null

  @Property({ default: 0 })
  failedAttempts = 0

  @Property({ nullable: true, type: "date" })
  lockUntil?: Date | null = null

   @Property({ nullable: true })
  pendingEmail?: string | null

  @Property({ nullable: true })
  emailChangeToken?: string | null

  @Property({ nullable: true })
  emailChangeExpiresAt?: Date | null

}
