NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)
GITHUB_PROJ := https://github.com/RedBug312/markdown-it-multimd-table

MODULE_PATH := ./node_modules/.bin


${MODULE_PATH}:
	npm install --save-dev

lint: ${MODULE_PATH}
	${MODULE_PATH}/eslint .

test: ${MODULE_PATH} lint
	${MODULE_PATH}/mocha -R spec

coverage: ${MODULE_PATH}
	${MODULE_PATH}/istanbul cover ${MODULE_PATH}/_mocha
	rm -rf ./coverage

test-ci: ${MODULE_PATH} lint
	# For Github integration test. You should use `make coverage` on local.
	${MODULE_PATH}/istanbul cover ${MODULE_PATH}/_mocha --report lcovonly -- -R spec
	cat ./coverage/lcov.info | ${MODULE_PATH}/coveralls
	rm -rf ./coverage

browserify: ${MODULE_PATH}
	# Browserify
	( printf "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */"; \
		${MODULE_PATH}/browserify . -s markdownitMultimdTable \
		) > dist/markdown-it-multimd-table.js
	# Minify
	${MODULE_PATH}/terser dist/markdown-it-multimd-table.js -b beautify=false,ascii_only=true -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/markdown-it-multimd-table.min.js

.PHONY: lint test coverage test-ci browserify
