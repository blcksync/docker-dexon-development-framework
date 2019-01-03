#!/bin/bash

docker run -it \
  --name dexon-ganache-cli \
  --rm \
  --hostname dexon-ganache \
  -p 127.0.0.1:7545:7545 \
  blcksync/dexon-ganache-cli:latest 
