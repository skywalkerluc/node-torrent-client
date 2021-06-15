'use strict';
const fs = require('fs');
const bencode = require('bencode');
const tracker = require('./tracker');

// bencode
const torrentBencode = fs.readFileSync('puppy.torrent');
const torrent = bencode.decode(torrentBencode);

tracker.getPeers(torrent, peers => {
  console.log(`List of peers: ${peers}`);
})