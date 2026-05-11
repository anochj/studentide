ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM new-ide:latest

USER root

# env vars
ENV DEBIAN_FRONTEND=noninteractive \
    JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64 \
    PATH="$JAVA_HOME/bin:$PATH"

# install java and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Latest LTS JDK
    openjdk-17-jdk \
    # Build systems
    maven \
    gradle \
    # Bot/Dev Utilities
    git \
    curl \
    jq \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
    checkstyle \
    && rm -rf /var/lib/apt/lists/*