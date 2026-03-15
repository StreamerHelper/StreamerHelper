# 本地开发指南

## 快速开始

### 1. 启动基础设施服务

```bash
cd web-server
docker compose -f docker-compose.dev.yml up -d
```

这会启动：
- PostgreSQL (localhost:5432)
- Redis (localhost:6379)
- MinIO (localhost:9000, Console: localhost:9001)

### 2. 配置应用

```bash
# 复制开发配置到 config 目录
mkdir -p config
cp settings.dev.json config/settings.json

# 安装依赖
npm install
```

### 3. 运行数据库迁移

```bash
npm run migration:run
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务将在 http://localhost:7001 启动。

## 配置文件搜索顺序

应用会按以下顺序搜索配置文件 `settings.json`：

1. `CONFIG_DIR` 环境变量指定的目录
2. `/app/config` (Docker 容器内)
3. `./config/settings.json` (本地开发)
4. `~/.streamer-helper/settings.json` (默认)

## 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| API | http://localhost:7001 | 后端 API |
| PostgreSQL | localhost:5432 | 数据库 (user: postgres, pass: postgres) |
| Redis | localhost:6379 | 缓存/队列 |
| MinIO API | http://localhost:9000 | 对象存储 |
| MinIO Console | http://localhost:9001 | 管理界面 (user: minioadmin, pass: minioadmin) |

## MinIO 设置

首次使用需要创建 bucket：

1. 打开 http://localhost:9001
2. 登录：`minioadmin` / `minioadmin`
3. 创建 bucket：`streamerhelper-archive`

## 常用命令

```bash
# 查看服务状态
docker compose -f docker-compose.dev.yml ps

# 查看日志
docker compose -f docker-compose.dev.yml logs -f

# 停止服务
docker compose -f docker-compose.dev.yml down

# 停止并删除数据
docker compose -f docker-compose.dev.yml down -v
```

## 数据库迁移

```bash
# 查看迁移状态
npm run migration:show

# 生成新迁移
npm run migration:generate -- -n MigrationName

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```
