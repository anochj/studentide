ARG TARGETPLATFORM=linux/arm64

# Builder stage - default layers provided by Theia
FROM --platform=$TARGETPLATFORM node:24-bookworm AS build-stage

RUN apt-get update && apt-get install -y libxkbfile-dev libsecret-1-dev

WORKDIR /home/theia

COPY . .

# needed, or you'll run out of memory
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN yarn config set network-timeout 600000 -g && \
    yarn --pure-lockfile && \
    yarn build:extensions && \
    yarn download:plugins && \
    yarn browser build && \
    yarn && \
    yarn autoclean --init && \
    echo *.ts >> .yarnclean && \
    echo *.ts.map >> .yarnclean && \
    echo *.spec.* >> .yarnclean && \
    yarn autoclean --force && \
    yarn cache clean && \
    rm -rf .git node_modules








# Production stage uses a small base image
FROM --platform=$TARGETPLATFORM node:24-bookworm-slim AS production-stage

# system deps + utils
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    zip \
    unzip \
    git \
    build-essential \
    jq \
    nano \
    tar \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# create a system + group user, where the home is /home/project
RUN adduser --system --group --uid 6767 --home /home/project theia

# copy build from the builder stage
COPY --from=build-stage /home/theia /opt/theia
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# restrict permissions on opt/theia
RUN chown -R root:root /opt/theia && \
    find /opt/theia -type d -exec chmod 755 {} + && \
    find /opt/theia -type f -exec chmod 644 {} +

EXPOSE 3000

ENV SHELL=/bin/bash \
    THEIA_DEFAULT_PLUGINS=local-dir:/opt/theia/plugins \
    USE_LOCAL_GIT=true 

WORKDIR /
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
