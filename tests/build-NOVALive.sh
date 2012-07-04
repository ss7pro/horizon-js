#!/bin/bash

. /home/ubuntu/dev/horizon-js/tests/build-inc.sh

OUT="/home/ubuntu/dev/horizon-js/tests/NOVA.Live.RunTests.html"

SRC="../js/models/SecGroupModel.js"
SRC+=" ../js/models/KeyPairModel.js"

LIST="JSTACK.Secgroup.live.js"
LIST+=" JSTACK.Keypair.live.js"


build_run_test
