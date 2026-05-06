ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM alpine:latest

COPY ./entrypoint.sh /entrypoint.sh

RUN apk add --no-cache \
    curl \
    zip

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
