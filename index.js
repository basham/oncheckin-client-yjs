import config from 'config';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
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

	const backup = debounce(
		() => backupDoc({ doc, name }),
		config.debounceBackupInterval
	);

	doc.on('update', () => {
		console.log(name, '> Updated');
		backup();
	});

	const provider = new WebsocketProvider(
		config.server,
		name,
		doc,
		{ WebSocketPolyfill: ws }
	);

	provider.on('status', event => {
		console.log(name, '>', sentenceCase(event.status));
	});

	return provider;
}

function backupDoc ({ doc, name }) {
	// Get the doc data as JSON.
	const data = JSON.stringify(doc.getMap(config.docRoot).toJSON());

	// Create a folder for the doc's backup files.
	const docOutFolder = path.join(config.docsDir, name);
	if (!fs.existsSync(docOutFolder)) {
		fs.mkdirSync(docOutFolder, { recursive: true });
	}

	// Abort backup if the content has not changed since last backup.
	const currFilePath = path.join(docOutFolder, `${config.docRoot}.json`);
	if (fs.existsSync(currFilePath)) {
		const curr = fs.readFileSync(currFilePath);
		if (curr.equals(Buffer.from(data))) {
			return;
		}
	}

	// Compress the new data as gzip JSON.
	// Keep the last data for any given day.
	const time = (new Date()).toJSON()
		.slice(0, 10);
	const fileName = path.join(docOutFolder, `${time}.json.gz`);
	const gz = zlib.gzipSync(data)
	fs.writeFileSync(fileName, gz);

	// Write the new data to the "current" file.
	fs.writeFileSync(currFilePath, data);

	console.log(name, '> Backed up');
}

function debounce (fn, timeout = 100) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, timeout);
	};
}

function sentenceCase (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

