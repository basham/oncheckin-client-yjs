import config from 'config';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ws from 'ws';

if (!fs.existsSync(config.dbDir)) {
	fs.mkdirSync(config.dbDir, { recursive: true });
}

process.env.YPERSISTENCE = config.dbDir;

const require = createRequire(import.meta.url);
const { WebsocketProvider } = require('y-websocket');
const { getYDoc } = require('y-websocket/bin/utils');

config.docs.forEach(syncDoc);

function syncDoc (name) {
	const doc = getYDoc(name);
	const provider = new WebsocketProvider(
		config.server,
		name,
		doc,
		{ WebSocketPolyfill: ws }
	);
	provider.on('status', event => {
		console.log(event.status, name, config.server);
	});
	return provider;
}

