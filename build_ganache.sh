#!/bin/bash

set -e

curr_dir=$(cd $(dirname $0); pwd)

pushd $curr_dir

docker build \
  -t blcksync/dexon-ganache-cli:latest \
  -f Dockerfile.ganache \
  .

ret=$?

popd

exit $ret
