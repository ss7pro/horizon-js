#!/bin/bash


LIST="JSTACK.Keystone.init.js"
LIST+=" JSTACK.Keystone.js"
LIST+=" RegionModel.js"
SPECDIR=/home/ubuntu/dev/horizon-js/tests/spec

HEADER=/home/ubuntu/dev/horizon-js/tests/Header.html
FOOTER=/home/ubuntu/dev/horizon-js/tests/Footer.html
OUT=/home/ubuntu/dev/horizon-js/tests/RunTests.html



(
	cat $HEADER
	for i in ${LIST} ; do
		cat $SPECDIR/$i
	done
	cat $FOOTER
) > $OUT
