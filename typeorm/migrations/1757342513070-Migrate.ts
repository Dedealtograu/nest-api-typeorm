import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Migrate1757342513070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '63',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '127',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '127',
            isNullable: false,
          },
          {
            name: 'birthAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'int',
            default: '1',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP()',
            isNullable: false,
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
