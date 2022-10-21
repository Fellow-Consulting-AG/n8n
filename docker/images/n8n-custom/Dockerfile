# old 
ARG NODE_VERSION=16

# 1. Create an image to build n8n
FROM n8nio/base:${NODE_VERSION} as builder

RUN \
	apk --no-cache add git
RUN \
	npm install -g run-script-os
RUN \
	npm install -g turbo@1.5.5

COPY turbo.json package.json package-lock.json ./
COPY packages ./packages

RUN chown -R node:node .
RUN npm config set legacy-peer-deps true

USER node

RUN \
	npm ci && \
	npm run build && \
	# TODO: removing dev dependecies is deleting `bn.js`, which breaks the Snowflake node
	npm prune --omit=dev && \
	npm i --omit=dev bn.js && \
	find . -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" | xargs rm &&\
	rm -rf node_modules/.cache packages/*/node_modules/.cache packages/*/.turbo .config .npm /tmp/*


# 2. Start with a new clean image with just the code that is needed to run n8n
FROM n8nio/base:${NODE_VERSION}
COPY --from=builder /home/node ./
COPY docker/images/n8n-custom/docker-entrypoint.sh ./

RUN \
	mkdir .n8n && \
	chown node:node .n8n
USER node
ENV NODE_ENV=production
ENTRYPOINT ["tini", "--", "./docker-entrypoint.sh"]



# newer
# # 1. Create an image to build n8n
# FROM node:16-alpine as builder

# # Update everything and install needed dependencies
# USER root

# # Install all needed dependencies
# RUN apk --update add --virtual build-dependencies python3 build-base ca-certificates && \
# 	npm_config_user=root npm install -g lerna run-script-os

# WORKDIR /data

# COPY lerna.json .
# COPY package.json .
# COPY packages/cli/ ./packages/cli/
# COPY packages/core/ ./packages/core/
# COPY packages/design-system/ ./packages/design-system/
# COPY packages/editor-ui/ ./packages/editor-ui/
# COPY packages/nodes-base/ ./packages/nodes-base/
# COPY packages/workflow/ ./packages/workflow/
# RUN rm -rf node_modules packages/*/node_modules packages/*/dist

# RUN npm config set legacy-peer-deps true
# RUN npm install --production --loglevel notice
# RUN lerna bootstrap --hoist -- --production
# RUN npm run build


# # 2. Start with a new clean image with just the code that is needed to run n8n
# FROM node:16-alpine

# USER root

# RUN apk add --update graphicsmagick tzdata tini su-exec git

# WORKDIR /data

# # Install all needed dependencies
# RUN npm_config_user=root npm install -g full-icu

# # Install fonts
# RUN apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig && \
# 	update-ms-fonts && \
# 	fc-cache -f && \
# 	apk del fonts && \
# 	find  /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \;

# ENV NODE_ICU_DATA /usr/local/lib/node_modules/full-icu

# COPY --from=builder /data ./

# COPY docker/images/n8n-custom/docker-entrypoint.sh /docker-entrypoint.sh
# ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

# EXPOSE 5678/tcp


# old 
# ARG NODE_VERSION=16

# # 1. Create an image to build n8n
# FROM n8nio/base:${NODE_VERSION} as builder

# RUN \
# 	apk --no-cache add git
# RUN \
# 	npm install -g run-script-os
# RUN \
# 	npm install -g turbo

# COPY turbo.json package.json package-lock.json ./
# COPY packages ./packages

# RUN chown -R node:node .
# RUN npm config set legacy-peer-deps true

# USER node

# RUN \
# 	npm ci && \
# 	npm run build && \
# 	# TODO: removing dev dependecies is deleting `bn.js`, which breaks the Snowflake node
# 	npm prune --omit=dev && \
# 	npm i --omit=dev bn.js && \
# 	find . -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" | xargs rm &&\
# 	rm -rf node_modules/.cache packages/*/node_modules/.cache packages/*/.turbo .config .npm /tmp/*


# # 2. Start with a new clean image with just the code that is needed to run n8n
# FROM n8nio/base:${NODE_VERSION}
# COPY --from=builder /home/node ./
# COPY docker/images/n8n-custom/docker-entrypoint.sh ./

# RUN \
# 	mkdir .n8n && \
# 	chown node:node .n8n
# USER node
# ENV NODE_ENV=production
# ENTRYPOINT ["tini", "--", "./docker-entrypoint.sh"]
