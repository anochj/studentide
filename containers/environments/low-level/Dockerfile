ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM new-ide:latest

USER root

ENV DEBIAN_FRONTEND=noninteractive \
    TERM=xterm-256color

RUN apt-get update && apt-get install -y --no-install-recommends \
    # core utils
    build-essential \
    gcc \
    g++ \
    cmake \
    make \
    gdb \
    clang \
    # useful stuff
    git \
    curl \
    wget \
    jq \
    ca-certificates \
    libssl-dev \
    # clean up
    && rm -rf /var/lib/apt/lists/*
