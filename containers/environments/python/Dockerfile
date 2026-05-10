ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM new-ide:latest

USER root

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
	PIP_NO_CACHE_DIR=1 \
	PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
	python3 \
	python3-pip \
	python3-venv \
	python3-dev \
	build-essential \
	&& rm -rf /var/lib/apt/lists/*
