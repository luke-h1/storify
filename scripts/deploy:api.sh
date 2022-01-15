#!/bin/bash
echo What should the version be ?
read VERSION
echo Enter IP address
read TARGET
echo Enter user 
read USER 
cd src/api
echo "Deploying API to production 🚀 🔥"
docker build -t lhowsam/storify:$VERSION .
docker push lhowsam/storify:$VERSION
ssh ${USER}@${TARGET} "docker pull lhowsam/storify:$VERSION && docker tag lhowsam/storify:$VERSION dokku/storify-api:$VERSION && dokku deploy storify-api $VERSION"
