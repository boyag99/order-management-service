# Stage base
FROM node:20-alpine AS base

RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Stage dev depends
FROM base AS builder

COPY . .

RUN pnpm build

# Stage prod depends
FROM base AS prod-deps

ENV NODE_ENV production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Stage prod
FROM base AS prod

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
