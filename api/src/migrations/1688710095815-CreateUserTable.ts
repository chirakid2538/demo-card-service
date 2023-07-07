import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUserTable1688710095815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'NOW() ON UPDATE NOW()',
          },
        ],
      }),
      false,
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'uniq_username',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user`);
  }
}
