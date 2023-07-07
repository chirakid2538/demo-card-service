"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTestTable1688703796699 = void 0;
const typeorm_1 = require("typeorm");
class CreateTestTable1688703796699 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'test',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
            ],
        }), false);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE test`);
    }
}
exports.CreateTestTable1688703796699 = CreateTestTable1688703796699;
//# sourceMappingURL=1688703796699-CreateTestTable.js.map