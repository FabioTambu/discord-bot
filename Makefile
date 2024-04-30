.PHONY: stop start

all: stop start

stop:
	-pkill -f "node src/index.js"

start:
	git fetch
	git merge
	nohup node src/index.js >/dev/null 2>&1 &
