import { Entity, Property, PrimaryKey } from "@mikro-orm/core"
import { randomUUID } from "crypto"

@Entity()
export class MagicLinkToken {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID()

  @Property()
  email!: string

  @Property()
  token: string = randomUUID()

  @Property()
  expiresAt: Date

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date()
}
