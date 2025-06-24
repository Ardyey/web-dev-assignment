#!/bin/sh

# Substitute environment variables in the nginx config
envsubst '${VITE_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'