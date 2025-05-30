import { Migration } from '@mikro-orm/migrations';

export class Migration20250530120319 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "magic_link_token" ("id" uuid not null, "email" varchar(255) not null, "token" varchar(255) not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, constraint "magic_link_token_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "password" varchar(255) null, "email" varchar(255) not null, "created_at" timestamptz not null, "role" varchar(255) not null default 'user', "refresh_token" varchar(255) null, "failed_attempts" int not null default 0, "lock_until" date null, "pending_email" varchar(255) null, "email_change_token" varchar(255) null, "email_change_expires_at" varchar(255) null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "magic_link_token" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
