#!/bin/bash
VERSION=2.1.0
docker build -t kojenka/spotify-playback-api:$VERSION .
docker tag kojenka/spotify-playback-api:$VERSION kojenka/spotify-playback-api:swagger-latest
docker push kojenka/spotify-playback-api:$VERSION
docker push kojenka/spotify-playback-api:swagger-latest
