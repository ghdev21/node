FROM node:18-alpine

WORKDIR /

COPY package.json yarn.lock /

RUN yarn install --frozen-lockfile

COPY . /

EXPOSE 3000

ENV PORT=3000

CMD ["yarn", "dev"]
