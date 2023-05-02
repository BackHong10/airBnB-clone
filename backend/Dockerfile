# 컴퓨터 만드는 설명서

# 1. 운영체제 설치
FROM node:14

COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
WORKDIR /myfolder/
RUN yarn install

COPY . /myfolder/




CMD yarn start:dev
