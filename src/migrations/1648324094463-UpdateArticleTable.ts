import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateArticleTable1648324094463 implements MigrationInterface {
    name = 'UpdateArticleTable1648324094463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "tagsList" TO "tagList"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "tagList" TO "tagsList"`);
    }

}
