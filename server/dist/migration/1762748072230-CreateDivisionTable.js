"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDivisionTable1712345678901 = void 0;
class CreateDivisionTable1712345678901 {
    name = 'CreateDivisionTable1712345678901';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE division (
                divisi_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await queryRunner.query(`
            INSERT INTO division (name) VALUES 
            ('Compliance')
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS divisi_id INT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            ADD CONSTRAINT fk_users_division 
            FOREIGN KEY (divisi_id) REFERENCES division(divisi_id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE users DROP FOREIGN KEY fk_users_division`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN divisi_id`);
        await queryRunner.query(`DROP TABLE division`);
    }
}
exports.CreateDivisionTable1712345678901 = CreateDivisionTable1712345678901;
//# sourceMappingURL=1762748072230-CreateDivisionTable.js.map