# 🐍 贪吃蛇小游戏

一个使用纯 HTML + CSS + JavaScript 编写的经典贪吃蛇游戏，无需任何依赖，打开即玩。

## ✨ 功能特性

- 方向键 / WASD 控制蛇的移动方向
- 空格键暂停 / 继续 / 重新开始
- 实时得分与本地最高分记录（localStorage）
- 吃到食物后蛇身增长，每 50 分自动加速
- 移动端虚拟方向按钮自适应显示
- 渐变蛇身配色 + 脉动食物效果

## 🎮 如何游玩

### 方式一：直接打开

用浏览器直接打开 `index.html` 即可开始游戏。

### 方式二：Docker 运行

确保已安装 Docker，然后在项目目录下执行：

```bash
# 构建镜像
docker build -t snake-game .

# 运行容器（映射到本地 8080 端口）
docker run -d -p 8080:80 --name snake-game snake-game

# 访问 http://localhost:8080 即可游玩
```

### 方式三：Docker Compose

```bash
# 一键启动
docker-compose up -d

# 访问 http://localhost:8080

# 停止
docker-compose down
```

### 操作说明

1. 按空格键或点击画布开始游戏
2. 使用方向键（或 WASD）控制方向
3. 吃到红色食物得分，撞墙或撞到自身则游戏结束

## 📁 项目结构

```
snake-game/
├── index.html          # 页面结构
├── style.css           # 样式
├── game.js             # 游戏逻辑
├── Dockerfile          # Docker 镜像构建配置
├── docker-compose.yml  # Docker Compose 配置
├── .dockerignore       # Docker 构建忽略文件
├── .gitignore          # Git 忽略文件
└── README.md           # 说明文档
```

## 🛠 技术栈

- HTML5 Canvas
- 原生 JavaScript（无框架依赖）
- CSS3 渐变与响应式布局
- Nginx（Docker 镜像基础）

## 📄 License

MIT
