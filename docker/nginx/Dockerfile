FROM nginx:stable-alpine

RUN apk add --no-cache gettext

COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/nginx-entrypoint.sh /docker-entrypoint.d/nginx-entrypoint.sh

RUN chmod +x /docker-entrypoint.d/nginx-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.d/nginx-entrypoint.sh"]
