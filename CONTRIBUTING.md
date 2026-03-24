# 贡献指南

感谢你有兴趣为 StreamerHelper 做出贡献！

## 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 在 [Issues](https://github.com/StreamerHelper/StreamerHelper/issues) 中搜索是否已有人报告
2. 如果没有，创建一个新的 Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（操作系统、Node版本等）
   - 相关日志或截图

### 提交功能建议

如果你有好的想法：

1. 先在 [Discussions](https://github.com/StreamerHelper/StreamerHelper/discussions) 中讨论
2. 讨论通过后，可以自己实现或等待其他人实现

### 提交代码

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   git clone https://github.com/YOUR_USERNAME/StreamerHelper.git
   cd StreamerHelper
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **进行修改**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add some feature"
   # 或
   git commit -m "fix: resolve some issue"
   ```

5. **推送到 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 填写 PR 模板
   - 等待代码审查

## 代码规范

### 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type):**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

**示例:**
```
feat(web): add segment count filter in content page

- Add switch and input for segment count filter
- Default value is 5 and enabled by default
- Update both frontend and backend to support filtering

Closes #123
```

### 代码风格

**后端 (MidwayJS/TypeScript):**
- 使用 [mwts](https://github.com/midwayjs/mwts) 进行代码检查
- 遵循 TypeScript 最佳实践
- 使用 ESLint 进行代码检查

```bash
cd web-server
pnpm run lint        # 检查代码
pnpm run lint:fix    # 自动修复
```

**前端 (Next.js/React):**
- 使用 ESLint + Prettier
- 遵循 React Hooks 规则
- 使用 TypeScript 类型

```bash
cd web
pnpm run lint        # 检查代码
```

## 开发环境设置

### 安装依赖

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 安装后端依赖
cd web-server && pnpm install

# 安装前端依赖
cd ../web && pnpm install
```

### 运行开发服务器

```bash
# 启动基础设施（在 infra 目录）
cd infra && ./bin/control infra up

# 启动后端（在 web-server 目录）
cd ../web-server && pnpm dev

# 启动前端（在 web 目录，新终端）
cd ../web && pnpm dev
```

### 运行测试

```bash
# 后端测试
cd web-server && pnpm test

# 前端测试（如果有）
cd web && pnpm test
```

## Pull Request 检查清单

提交 PR 前请确保：

- [ ] 代码通过所有检查（lint, test）
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] PR 描述清晰说明了更改内容

## 获取帮助

如果你有任何问题：

- 查看 [文档](README.md)
- 在 [Discussions](https://github.com/StreamerHelper/StreamerHelper/discussions) 中提问
- 加入我们的社区（如果有）

---

再次感谢你的贡献！🎉
