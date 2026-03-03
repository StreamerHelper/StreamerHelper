import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBilibiliSubmissions1700000000001 implements MigrationInterface {
  name = 'AddBilibiliSubmissions1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建投稿状态枚举
    await queryRunner.query(`
      CREATE TYPE submission_status AS ENUM ('pending', 'uploading', 'submitting', 'completed', 'failed');
    `);

    // 创建分P状态枚举
    await queryRunner.query(`
      CREATE TYPE part_status AS ENUM ('pending', 'merging', 'uploading', 'completed', 'failed');
    `);

    // 创建投稿表
    await queryRunner.query(`
      CREATE TABLE bilibili_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id VARCHAR(255) NOT NULL,

        -- 投稿信息
        title VARCHAR(80) NOT NULL,
        description VARCHAR(2000),
        tags TEXT[],
        tid INTEGER DEFAULT 171,
        cover VARCHAR(500),
        copyright INTEGER DEFAULT 1,
        source VARCHAR(500),
        dynamic VARCHAR(500),

        -- 投稿状态
        status submission_status DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,

        -- 分P信息
        parts JSONB NOT NULL DEFAULT '[]',
        total_parts INTEGER DEFAULT 0,
        completed_parts INTEGER DEFAULT 0,

        -- B站返回信息
        bvid VARCHAR(20),
        avid BIGINT,

        -- 错误信息
        last_error VARCHAR(2000),

        -- 时间戳
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 创建索引
    await queryRunner.query(`
      CREATE INDEX idx_bilibili_submissions_job_id ON bilibili_submissions(job_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_bilibili_submissions_status ON bilibili_submissions(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS idx_bilibili_submissions_status;'
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS idx_bilibili_submissions_job_id;'
    );
    await queryRunner.query('DROP TABLE IF EXISTS bilibili_submissions;');
    await queryRunner.query('DROP TYPE IF EXISTS part_status;');
    await queryRunner.query('DROP TYPE IF EXISTS submission_status;');
  }
}
