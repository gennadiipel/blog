import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserEntity1647977068854 implements MigrationInterface {
    name = 'UpdateUserEntity1647977068854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "image" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "image" DROP DEFAULT`);
    }

}
