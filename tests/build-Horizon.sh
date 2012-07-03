#!/bin/bash

. /home/ubuntu/dev/horizon-js/tests/build-inc.sh

OUT="/home/ubuntu/dev/horizon-js/tests/Horizon.RunTests.html"

#LIST="Helpers.js"
LIST="Horizon.js"

SRC="../lib/require.js"
SRC+=" ../js/load-modules.js"

build_run_test
