#!/bin/bash


HEADER="/home/ubuntu/dev/horizon-js/tests/Header.html"
FOOTER="/home/ubuntu/dev/horizon-js/tests/Footer.html"
PREFOOTER="/home/ubuntu/dev/horizon-js/tests/PreFooter.html"


function build_run_test {
	if [ "${OUT}" == "" ] ; then
		return
	fi

	(
		cat $HEADER
		for i in $LIST ; do
			echo -n '<script type="text/javascript" src="'
			echo -n "spec/${i}"
			echo -n '"></script>'
			echo
		done
		cat $PREFOOTER
			for i in $SRC ; do
			echo -n '<script type="text/javascript" src="'
			echo -n "${i}"
			echo -n '"></script>'
			echo
		done
		cat $FOOTER
	) > $OUT

}
