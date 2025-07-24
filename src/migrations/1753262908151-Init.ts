import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753262908151 implements MigrationInterface {
  name = 'Init1753262908151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dish_tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_16fe57ccaa45160f7f49d29c032" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dishes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "image_url" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_f4748c8e8382ad34ef517520b7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dish_tag_map" ("dish_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_bdb98a8982fe62928f530073e09" PRIMARY KEY ("dish_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ad3bddab15799dbe078aeba68" ON "dish_tag_map" ("dish_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b90bcfa9c0798d4a983fe282a4" ON "dish_tag_map" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "dishes" ADD CONSTRAINT "FK_4392e7a4005af3458e671a00774" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_tag_map" ADD CONSTRAINT "FK_4ad3bddab15799dbe078aeba68f" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_tag_map" ADD CONSTRAINT "FK_b90bcfa9c0798d4a983fe282a46" FOREIGN KEY ("tag_id") REFERENCES "dish_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dish_tag_map" DROP CONSTRAINT "FK_b90bcfa9c0798d4a983fe282a46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dish_tag_map" DROP CONSTRAINT "FK_4ad3bddab15799dbe078aeba68f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dishes" DROP CONSTRAINT "FK_4392e7a4005af3458e671a00774"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b90bcfa9c0798d4a983fe282a4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ad3bddab15799dbe078aeba68"`,
    );
    await queryRunner.query(`DROP TABLE "dish_tag_map"`);
    await queryRunner.query(`DROP TABLE "dishes"`);
    await queryRunner.query(`DROP TABLE "dish_tags"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
