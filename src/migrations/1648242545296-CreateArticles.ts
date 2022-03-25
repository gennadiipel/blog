import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateArticles1648242545296 implements MigrationInterface {
    name = 'CreateArticles1648242545296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "excerpt" character varying NOT NULL DEFAULT '', "content" character varying NOT NULL DEFAULT '', "tagsList" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "image" character varying NOT NULL DEFAULT 'image', "likesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
