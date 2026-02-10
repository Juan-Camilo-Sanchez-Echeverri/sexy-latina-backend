#!/bin/sh
set -e

# Require PORT to be provided by environment (no default)
: "${PORT}"

# Replace ${PORT} in the template and write to nginx config
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
