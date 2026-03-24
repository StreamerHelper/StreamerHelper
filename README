# StreamerHelper

<div align="center">

![StreamerHelper Logo](https://s1.ax1x.com/2020/07/22/UbKCpq.png)

全自动直播录制 & B站投稿系统

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Release](https://img.shields.io/github/v/release/StreamerHelper/StreamerHelper)](https://github.com/StreamerHelper/StreamerHelper/releases)

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [部署指南](#-部署指南) • [架构说明](#%EF%B8%8F-架构说明) • [贡献指南](#-贡献指南)

</div>

---

## ✨ 功能特性

StreamerHelper 是一个功能强大的直播录制自动化系统，支持多个主流直播平台：

- 🎥 **多平台支持** - 支持 B站直播、虎牙、斗鱼三大平台
- 🔄 **自动录制** - 检测到开播自动开始录制，支持断线重连
- 📦 **智能分片** - 自动将录制内容分片存储，便于管理和上传
- ⬆️ **自动上传** - 录制完成后自动上传到对象存储
- 📝 **B站投稿** - 支持一键投稿到B站，自动填写视频信息
- 🎛️ **Web管理** - 直观的Web界面，管理主播、任务和内容
- 📊 **系统监控** - 实时查看录制状态、队列情况和系统资源
- 🗄️ **数据持久化** - PostgreSQL存储所有录制记录和主播信息

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Docker & Docker Compose
- pnpm (推荐) 或 npm

### 一键启动

```bash
# 克隆仓库
git clone https://github.com/StreamerHelper/StreamerHelper.git
cd StreamerHelper/infra

# 安装依赖并初始化配置
npm install
./bin/configure init

# 启动所有服务
./bin/control up
```

服务启动后访问：
- **Web界面**: http://localhost
- **Bull Board**: http://localhost/ui
- **MinIO控制台**: http://localhost:9001

### 手动部署

如果你想自己部署各个组件，请参考各子仓库：

- [infra](https://github.com/StreamerHelper/infra) - Docker部署配置
- [web-server](https://github.com/StreamerHelper/web-server) - 后端服务
- [web](https://github.com/StreamerHelper/web) - 前端界面

---

## 📦 部署指南

### 使用 Docker Compose（推荐）

```bash
# 1. 启动基础设施（数据库、缓存、存储）
cd infra && ./bin/control infra up

# 2. 运行数据库迁移
./bin/control migrate

# 3. 启动应用服务
./bin/control app up
```

### 配置说明

配置文件位于 `~/.streamer-helper/settings.json`，主要包含：

| 配置项 | 说明 |
|--------|------|
| `app.keys` | 应用加密密钥 |
| `database` | PostgreSQL 连接信息 |
| `redis` | Redis 连接信息 |
| `s3` | 对象存储配置（MinIO/S3） |
| `recorder.segmentDuration` | 录制分片时长（秒） |
| `poller.checkInterval` | 开播检测间隔（秒） |

### 生产环境部署

```bash
# 构建镜像
./build-and-push.sh v2.0.0

# 使用生产配置启动
docker-compose -f docker-compose.app.yml up -d
```

---

## 🏗️ 架构说明

### 系统架构

```
                    ┌─────────────┐
                    │   Nginx     │ :80/:443
                    │  (反向代理)  │
                    └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Frontend │        │ Backend  │        │ Bull     │
│(Next.js) │        │(MidwayJS)│        │ Board    │
│  :3000   │        │  :7001   │        │  /ui/    │
└──────────┘        └────┬─────┘        └──────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │PostgreSQL│    │  Redis   │    │  MinIO   │
  │  :5432   │    │  :6379   │    │:9000/9001│
  └──────────┘    └──────────┘    └──────────┘
```

### 工作流程

1. **开播检测** - 定期检查主播是否开播
2. **自动录制** - 检测到开播后自动开始录制
3. **分片存储** - 录制内容按设定时长分片上传到对象存储
4. **自动处理** - 录制结束后进行视频处理
5. **B站投稿** - 支持手动或自动投稿到B站

### 技术栈

| 组件 | 技术 |
|------|------|
| 前端 | Next.js 16, React 19, Tailwind CSS |
| 后端 | MidwayJS 3, Koa, TypeORM |
| 数据库 | PostgreSQL |
| 缓存 | Redis, BullMQ |
| 存储 | MinIO (S3兼容) |
| 反向代理 | Nginx |

---

## 📚 项目结构

```
StreamerHelper/
├── infra/          # Docker部署配置和管理工具
│   ├── bin/        # 配置和管理脚本
│   ├── nginx/      # Nginx配置
│   └── docker-*.yml # Docker Compose文件
├── web-server/     # 后端服务 (MidwayJS)
│   ├── src/
│   │   ├── controller/  # API控制器
│   │   ├── service/     # 业务逻辑
│   │   ├── entity/      # 数据模型
│   │   └── processor/   # 任务处理器
│   └── package.json
└── web/            # 前端界面 (Next.js)
    ├── app/        # 页面路由
    ├── components/ # UI组件
    └── package.json
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 后端遵循 [mwts](https://github.com/midwayjs/mwts) 规范
- 前端使用 ESLint + Prettier
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

---

## 📮 联系我们

- GitHub Issues: [https://github.com/StreamerHelper/StreamerHelper/issues](https://github.com/StreamerHelper/StreamerHelper/issues)
- Discussions: [https://github.com/StreamerHelper/StreamerHelper/discussions](https://github.com/StreamerHelper/StreamerHelper/discussions)

---

<p align="center">
  <sub>Built with ❤️ by the StreamerHelper community</sub>
</p>
