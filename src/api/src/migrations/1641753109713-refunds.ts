import { MigrationInterface, QueryRunner } from 'typeorm';

export class refunds1641753109713 implements MigrationInterface {
  name = 'refunds1641753109713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "paymentIntentId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "paymentIntentId"`,
    );
  }
}
