'use strict';
const fs = require('fs');
const bencode = require('bencode');

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const { URL } = require('url');

// bencode
const torrentBencode = fs.readFileSync('puppy.torrent');
const torrent = bencode.decode(torrentBencode);

const url = URL(torrent.announce.toString('utf-8'));
const socket = dgram.createSocket('udp4');
const testMsg = Buffer.from('hello world', 'utf-8');

socket.send(testMsg, 0, testMsg.length, url.port, url.host, () => {
  {}
});

socket.on('message', msg => {
  console.log(`message is ${msg}`);
});