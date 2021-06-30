const path = require('path');
const { open } = require('./torrent-parser');
const download = require('./download');


const torrent = open(path.resolve(__dirname, '../public/puppy.torrent'));
download(torrent);