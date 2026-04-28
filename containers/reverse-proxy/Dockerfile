ARG TARGETPLATFORM=linux/arm64

FROM --platform=$TARGETPLATFORM nginx:alpine

COPY ./nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
