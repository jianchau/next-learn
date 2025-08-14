# Next.js 学习项目集合

这个仓库用于管理多个 Next.js 学习项目。

## 项目结构

```
next-learn/
├── .gitignore          # 统一的 Git 忽略规则
├── README.md           # 项目说明文档
├── next-cache/         # Next.js 缓存学习项目
├── next-routing/       # Next.js 路由学习项目（示例）
├── next-api/           # Next.js API 学习项目（示例）
└── ...
```

## Git 管理策略

### 统一仓库管理
- 使用单个 Git 仓库管理所有 Next.js 学习项目
- 父目录 `next-learn` 作为 Git 根目录
- 所有子项目共享同一个 `.gitignore` 文件

### 分支策略
- `main` 分支：稳定的学习项目代码
- `feature/project-name` 分支：开发特定项目功能
- `experiment/topic` 分支：实验性代码

### 提交规范
建议使用以下提交信息格式：
```
[项目名] 功能描述

例如：
[next-cache] 添加服务端缓存示例
[next-routing] 实现动态路由功能
```

## 新建项目步骤

1. 在 `next-learn` 目录下创建新的项目文件夹
2. 初始化 Next.js 项目（不要运行 `git init`）
3. 删除项目中的 `.gitignore` 文件（如果有）
4. 在父目录提交代码

## 常用命令

```bash
# 查看所有项目状态
git status

# 添加特定项目的更改
git add next-cache/

# 提交更改
git commit -m "[next-cache] 添加新功能"

# 查看项目历史
git log --oneline
```

## 注意事项

- 不要在子项目中初始化 Git 仓库
- 子项目的 `.gitignore` 文件会被父目录的规则覆盖
- 建议为每个学习主题创建独立的分支
- 定期清理不需要的实验性代码