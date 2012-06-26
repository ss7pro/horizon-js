#!/bin/bash

. /home/ubuntu/dev/horizon-js/tests/build-inc.sh

OUT="/home/ubuntu/dev/horizon-js/tests/JSTACK.RunTests.html"

LIST="Helpers.js"
LIST+=" JSTACK.fixtures.js"
LIST+=" JSTACK.Keystone.init.js"
LIST+=" JSTACK.Keystone.js"
LIST+=" RegionModel.js"

SRC="../js/models/RegionModel.js"
SRC+=" ../js/os-utils.js"

build_run_test
