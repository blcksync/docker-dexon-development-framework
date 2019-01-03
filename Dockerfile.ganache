FROM blcksync/alpine-node:latest as builder

USER root
RUN apk add --no-cache make gcc g++ python git bash && mkdir /app && cd /app ; \
    git clone https://github.com/dexon-foundation/ganache-cli.git dexon-ganache-cli;
    
WORKDIR /app/dexon-ganache-cli
RUN cd /app/dexon-ganache-cli; npm install

RUN NODE_OPTIONS="--max-old-space-size=4096" npx webpack-cli --config ./webpack/webpack.docker.config.js

FROM blcksync/alpine-node:latest as runtime

USER root
RUN mkdir /app; apk add --no-cache bash
WORKDIR /app

COPY --from=builder "/app/dexon-ganache-cli/node_modules/scrypt/build/Release" "./node_modules/scrypt/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/node_modules/@dexon-foundation/ganache-core/node_modules/scrypt/build/Release" "./node_modules/@dexon-foundation/ganache-core/node_modules/scrypt/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/node_modules/@dexon-foundation/ganache-core/node_modules/secp256k1/build/Release" "./node_modules/@dexon-foundation/ganache-core/node_modules/secp256k1/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/node_modules/@dexon-foundation/ganache-core/node_modules/keccak/build/Release" "./node_modules/@dexon-foundation/ganache-core/node_modules/keccak/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/node_modules/sha3/build/Release" "./node_modules/sha3/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/node_modules/@dexon-foundation/ganache-core/node_modules/websocket/build/Release" "./node_modules/@dexon-foundation/ganache-core/node_modules/websocket/build/Release/"
COPY --from=builder "/app/dexon-ganache-cli/build/ganache-core.docker.cli.js" "./ganache-core.docker.cli.js"
COPY --from=builder "/app/dexon-ganache-cli/build/ganache-core.docker.cli.js.map" "./ganache-core.docker.cli.js.map"
COPY --from=builder "/app/dexon-ganache-cli/args.js" "./args.js"
COPY --from=builder "/app/dexon-ganache-cli/lib.js" "./lib.js"
COPY --from=builder "/app/dexon-ganache-cli/package.json" "./package.json"

COPY dexon-ganache.js /app/dexon-ganache.js
COPY secret.js /app/secret.js
COPY truffle.js /app/truffle.js

RUN npm link @dexon-foundation/ganache-cli && npm link bn.js && npm link yargs

# This triggers nic to listen on 0.0.0.0
ENV DOCKER true

EXPOSE 7545

# -h 0.0.0.0 added after ganachi 6.0.0 to listen on all interface
# -h not required if building inside docker
ENTRYPOINT ["node", "/app/dexon-ganache.js", "-p 7545", "-u 0", "-u 1", "-u 2", "-u 3", "-u 4", "-u 5", "-u 6", "-u 7", "-u 8", "-u 9"]

CMD ["bash"]
