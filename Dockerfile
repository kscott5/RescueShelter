# https://hub.docker.com/_/nginx
# https://www.nginx.com/resources/wiki/start/topics/tutorials/commandline/
# https://www.docker.com/blog/tips-for-deploying-nginx-official-image-with-docker/
FROM nginx:latest

# https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL org.opencontainers.image.title="Rescue Shelter React UI"
LABEL org.opencontainers.image.url="https://githhub.com/kscott5/rescueshelter"
LABEL org.opencontainers.image.source="https://githhub.com/kscott5/rescueshelter"
LABEL org.opencontainers.image.version="v2.0.1"

EXPOSE 80

RUN mkdir /app  && \
    mkdir /app/html && \
    mkdir /app/json && \
    mkdir /app/logs && \
    mkdir /app/ssl

WORKDIR /app

RUN rm /etc/nginx/conf.d/** -rf

COPY ./nginx/conf.d/** /etc/nginx/conf.d/
COPY ./nginx/nginx.conf /etc/nginx/

COPY ./nginx/html/** /app/html/
COPY ./nginx/json/** /app/json/
COPY ./nginx/ssl/  /app/ssl/
COPY ./dist/*.* /app/html/
COPY ./dist/assets/ /app/html/assets/
COPY ./dist/locales/ /app/html/locals/
