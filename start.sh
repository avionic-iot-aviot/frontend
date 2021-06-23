#!/bin/sh

git clone https://github.com/avionic-iot-aviot/frontend
cd frontend
echo VUE_APP_MAPS_API_KEY=$MAPS_API_KEY >> .env
npm install
npm run build
http-server dist