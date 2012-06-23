#!/bin/bash


LIST="Helpers.js"
LIST+=" JSTACK.fixtures.js"
LIST+=" JSTACK.Keystone.init.js"
LIST+=" JSTACK.Keystone.js"
LIST+=" RegionModel.js"


HORIZON=" ../js/models/RegionModel.js"

HEADER="/home/ubuntu/dev/horizon-js/tests/Header.html"
FOOTER="/home/ubuntu/dev/horizon-js/tests/Footer.html"
PREFOOTER="/home/ubuntu/dev/horizon-js/tests/PreFooter.html"
OUT="/home/ubuntu/dev/horizon-js/tests/RunTests.html"



(
	cat $HEADER
	for i in ${LIST} ; do
		echo -n '<script type="text/javascript" src="'
		echo -n "spec/${i}"
		echo -n '"></script>'
		echo
	done
	cat $PREFOOTER
	for i in ${HORIZON} ; do
		echo -n '<script type="text/javascript" src="'
		echo -n "${i}"
		echo -n '"></script>'
		echo
	done
	cat $FOOTER
) > $OUT
