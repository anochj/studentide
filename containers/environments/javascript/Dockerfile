ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM new-ide:latest

USER root

ENV DEBIAN_FRONTEND=noninteractive \
    TERM=xterm-256color \
    BUN_INSTALL="/root/.bun" \
    PATH="/root/.bun/bin:$PATH"

# system utils
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    jq \
    unzip \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# nodejs install
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# enabked core pack (yarn and pnpm)
RUN corepack enable

# install Bun
RUN curl -fsSL https://bun.sh/install | bash

# useful js utils
RUN npm install -g \
    typescript \
    tsx \
    nodemon \
    eslint \
    prettier \
    pm2