# 使用轻量级 nginx 镜像
FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 将游戏文件复制到 nginx 静态文件目录
COPY index.html .
COPY style.css .
COPY game.js .

# 暴露 80 端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# 启动 nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]
