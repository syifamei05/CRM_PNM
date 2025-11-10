import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDivisionTable1712345678901 implements MigrationInterface {
  name = 'CreateDivisionTable1712345678901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Buat tabel division
    await queryRunner.query(`
            CREATE TABLE division (
                divisi_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

    // Insert data default (Compliance)
    await queryRunner.query(`
            INSERT INTO division (name) VALUES 
            ('Compliance')
        `);

    // Tambah kolom divisi_id ke tabel users jika belum ada
    await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS divisi_id INT NULL
        `);

    // Tambah foreign key
    await queryRunner.query(`
            ALTER TABLE users 
            ADD CONSTRAINT fk_users_division 
            FOREIGN KEY (divisi_id) REFERENCES division(divisi_id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hapus foreign key
    await queryRunner.query(
      `ALTER TABLE users DROP FOREIGN KEY fk_users_division`,
    );

    // Hapus kolom divisi_id
    await queryRunner.query(`ALTER TABLE users DROP COLUMN divisi_id`);

    // Hapus tabel division
    await queryRunner.query(`DROP TABLE division`);
  }
}
