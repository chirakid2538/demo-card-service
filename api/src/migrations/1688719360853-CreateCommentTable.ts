import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCommentTable1688719360853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'card_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'message',
            type: 'text',
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

    await queryRunner.createForeignKey(
      'comment',
      new TableForeignKey({
        name: 'fk_comment_card',
        columnNames: ['card_id'],
        referencedTableName: 'card',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'comment',
      new TableForeignKey({
        name: 'fk_comment_user',
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE comment`);
  }
}
