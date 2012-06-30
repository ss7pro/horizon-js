#!/bin/bash

. /home/ubuntu/dev/horizon-js/tests/build-inc.sh

OUT="/home/ubuntu/dev/horizon-js/tests/NOVA.RunTests.html"

LIST="Helpers.js"
LIST+=" JSTACK.fixtures.js"
LIST+=" NOVA.fixtures.js"
LIST+=" ImageModel.js"
LIST+=" JSTACK.Secgroup.js"

SRC=" ../js/models/ImageModel.js"

build_run_test
