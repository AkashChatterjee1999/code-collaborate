FROM node:16-alpine3.11 as baseImage  
RUN yarn install
RUN yarn global add serve
RUN mkdir /usr/app 
WORKDIR /usr/app
COPY ./ ./
RUN yarn
RUN yarn build 
CMD serve -s build 