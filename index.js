'use strict';
const fs = require('fs');
const bencode = require('bencode');

// bencode
const torrentBencode = fs.readFileSync('puppy.torrent');
console.log(torrentBencode.toString('utf-8'));

const torrent = bencode.decode(torrentBencode);
console.log(torrent, 'torrentDecoded');