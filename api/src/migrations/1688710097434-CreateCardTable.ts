import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCardTable1688710097434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'card',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
            default: null,
            isNullable: true,
          },
          {
            name: 'state',
            type: 'enum',
            default: `'to_do'`,
            enum: ['to_do', 'in_progress', 'done'],
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
          {
            name: 'archived_at',
            type: 'datetime',
            default: null,
            isNullable: true,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE card`);
  }
}
