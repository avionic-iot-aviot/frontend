FROM node:lts-alpine

RUN npm install -g http-server
RUN apk add git

WORKDIR /root

COPY start.sh .

EXPOSE 8080
CMD [ "sleep", "infinity" ]
#CMD [ "start.sh" ]
