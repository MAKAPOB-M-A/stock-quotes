FROM node:lts-alpine3.17 as dependencies
WORKDIR /stock-quotes
COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:lts-alpine3.17 as builder
WORKDIR /stock-quotes
COPY . .
COPY --from=dependencies /stock-quotes/node_modules ./node_modules
RUN npm run build

FROM node:lts-alpine3.17 as runner
WORKDIR /stock-quotes
ENV NODE_ENV production

COPY --from=builder /stock-quotes/public ./public
COPY --from=builder /stock-quotes/package.json ./package.json
COPY --from=builder /stock-quotes/.next ./.next
COPY --from=builder /stock-quotes/node_modules ./node_modules
COPY --from=builder /stock-quotes/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npm run db:deploy && npm start"]


