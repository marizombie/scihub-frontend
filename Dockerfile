# Stage 1: Build the app
FROM node:21.5-alpine3.18 as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
# Stage 2: Create the production image
FROM node:21.5-alpine3.18
COPY --from=builder /app/.output /.output
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD ["node", ".output/server/index.mjs"]