.PHONY: all

all:
	pkill -f "node src/index.js" || true
	git fetch
	git merge
	node src/index.js
