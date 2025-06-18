# QianKun微前端应用示例

本项目是一个基于[qiankun](https://qiankun.umijs.org/)的微前端应用示例，包含一个主应用和两个React子应用。

## 项目结构

```
qiankun-micro-fe/
├── main/             # 主应用
├── sub-app1/         # 第一个子应用
└── sub-app2/         # 第二个子应用
```

## 技术栈

- 微前端框架：qiankun
- 前端框架：React
- 构建工具：webpack
- 包管理工具：pnpm

## 安装依赖

在项目根目录下运行：

```bash
pnpm install
```

## 启动应用

### 启动所有应用

```bash
pnpm start
```

### 分别启动各个应用

启动主应用：

```bash
pnpm start:main
```

启动子应用1：

```bash
pnpm start:sub-app1
```

启动子应用2：

```bash
pnpm start:sub-app2
```

## 应用访问地址

- 主应用：http://localhost:8000
- 子应用1：http://localhost:8001
- 子应用2：http://localhost:8002

## 构建应用

```bash
pnpm build
```

## 项目说明

1. 主应用负责集成和管理子应用，提供整体的布局框架
2. 子应用1和子应用2是独立的React应用，可以单独开发、测试和部署
3. 子应用通过qiankun的生命周期函数与主应用通信和集成 