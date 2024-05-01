.PHONY: stop start

all: stop start

stop:
	-pkill -f "node src/index.js"

start:
	git fetch
	git merge
	nohup sh -c 'echo "Error log started at: $$(date)" >> error.txt && node src/index.js >> error.txt 2>&1 &' >/dev/null 2>&1 &
