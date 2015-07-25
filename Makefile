BIN := node_modules/.bin

all: notify-ui.d.ts index.js

$(BIN)/tsc:
	npm install

notify-ui.d.ts: index.ts $(BIN)/tsc
	sed 's:^//// ::g' $< > module.ts
	$(BIN)/tsc --module commonjs --target ES5 --declaration module.ts
	sed 's:export declare module notifyui:declare module "notify-ui":' <module.d.ts >$@
	rm module.{ts,d.ts,js}
