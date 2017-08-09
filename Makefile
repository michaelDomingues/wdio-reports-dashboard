.PHONY: install generate_reports run 

all: install generate_reports run

install:
	bower cache clean
	-rm -rf bower_components
	bower install
	npm install

generate_reports:
	node results_parser.js

run:
	gulp