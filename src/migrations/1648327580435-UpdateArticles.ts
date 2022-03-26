import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateArticles1648327580435 implements MigrationInterface {
    name = 'UpdateArticles1648327580435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "titleSlug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "urlSlug" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "urlSlug"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "titleSlug"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "slug" character varying NOT NULL`);
    }

}
