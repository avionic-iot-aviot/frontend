FROM node:lts-alpine

RUN npm install -g http-server
RUN apk add git

WORKDIR /root

COPY start.sh .

#RUN mkdir frontend
#COPY . ./frontend/

EXPOSE 8080
CMD [ "./start.sh" ]
