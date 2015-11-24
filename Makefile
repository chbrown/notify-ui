BIN := node_modules/.bin

all: index.js index.d.ts

$(BIN)/tsc:
	npm install

index.js index.d.ts: index.ts $(BIN)/tsc
	$(BIN)/tsc -d
