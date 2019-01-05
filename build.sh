#!/bin/bash

set -e

curr_dir=$(cd $(dirname $0); pwd)

pushd $curr_dir

docker build \
  -t blcksync/dexon-development-framework:latest \
  -f Dockerfile \
  .

ret=$?

popd

exit $ret
