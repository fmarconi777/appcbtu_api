FROM node:16

WORKDIR /appcbtu-api

ADD ./package.json .
ADD ./.env .

LABEL description="Appcbtu API"
LABEL version="1.0"

RUN npm install --omit=dev
