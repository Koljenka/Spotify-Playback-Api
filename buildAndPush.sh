#!/bin/bash
VERSION=1.2.7
docker build -t kojenka/spotify-playback-api:$VERSION .
docker tag kojenka/spotify-playback-api:$VERSION kojenka/spotify-playback-api:latest
docker push kojenka/spotify-playback-api:$VERSION
docker push kojenka/spotify-playback-api:latest
