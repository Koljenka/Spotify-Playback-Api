#!/bin/bash

wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.0.1/openapi-generator-cli-6.0.1.jar -O openapi-generator-cli.jar

java -jar openapi-generator-cli.jar generate -g nodejs-express-server -i ./swagger/swagger/swagger-node.yaml -o ./src
