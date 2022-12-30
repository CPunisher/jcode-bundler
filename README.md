# JCode Bundler

## 文件介绍

- `interface.ts`: 图、节点等类型定义
- `compiler.ts`: Babel 简单封装
- `utils.ts`: 转 base64、解析 rawUrl 等工具函数
- `dependency-graph.ts`: 构建依赖图、拓扑排序打包
- `babel-plugin.ts`: 构建依赖图和打包的 Babel 插件定义
- `index.ts`: 入口代码

## 运行 Example

- 打包主程序

```shell
pnpm install
pnpm run build
```

- 运行后端

```shell
cd examples/node-server
pnpm install
node index.js
```

- 运行前端

```shell
cd examples/web-example
pnpm install
pnpm run dev
```