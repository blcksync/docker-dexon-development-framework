FROM blcksync/alpine-node:latest as builder

LABEL maintainer="matr1xc0in"

ENV SHELL=/bin/bash

USER root
WORKDIR /root

COPY package.json /root/package.json

RUN cd /root; \
    apk update && apk upgrade && \
    apk add --no-cache bash git \
    busybox-extras \
    python \
    python-dev \
    py-pip \
    libtool \
    autoconf \
    automake \
    build-base \
    make gcc musl-dev linux-headers \
    ca-certificates \
    python2 \
    py-setuptools \
    && rm -rf /var/cache/apk/* \
    && if [[ ! -e /usr/bin/python ]];        then ln -sf /usr/bin/python2.7 /usr/bin/python; fi \
    && if [[ ! -e /usr/bin/python-config ]]; then ln -sf /usr/bin/python2.7-config /usr/bin/python-config; fi \
    && if [[ ! -e /usr/bin/easy_install ]];  then ln -sf /usr/bin/easy_install-2.7 /usr/bin/easy_install; fi ; \
    npm install -g tar@4.4.8 node-gyp@3.8.0 && npm install --python=/usr/bin/python && \
    npm install -g \
      @dexon-foundation/truffle@5.0.12 \
      @dexon-foundation/dsolc@0.5.2 \
      @dexon-foundation/ganache-cli@6.2.5 \
      @dexon-foundation/truffle-hdwallet-provider@1.0.11 \
      truffle-hdwallet-provider@1.0.5 \
      web3@1.0.0-beta.49

FROM blcksync/alpine-node:latest as runtime

USER root
WORKDIR /root

COPY --from=builder /usr/bin/python2.7 /usr/bin/python2.7
COPY --from=builder /usr/lib/node_modules /usr/lib/node_modules

RUN cd /root; \
    apk update && apk upgrade && \
    apk add --no-cache bash \
      git \
      busybox-extras \
      ca-certificates \
    && rm -rf /var/cache/apk/* ; \
    cd /usr/bin ; \
    ln -sf ../lib/node_modules/@dexon-foundation/dsolc/dsolcjs dsolcjs ; \
    ln -sf ../lib/node_modules/@dexon-foundation/truffle/build/cli.bundled.js dexon-truffle ; \
    mkdir /root/node_modules ; cd /root/node_modules ; \
    ln -s /usr/lib/node_modules/truffle-hdwallet-provider

COPY package.json /root/package.json
COPY secret.js /root/secret.js
COPY truffle.js /root/truffle.js

CMD ["bash"]
