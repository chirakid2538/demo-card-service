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
            name: 'display_name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'profile_image',
            type: 'varchar',
            default: null,
            isNullable: true,
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
        name: 'uniq_user_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user`);
  }
}
