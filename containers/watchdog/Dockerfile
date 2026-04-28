ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM alpine:latest

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
