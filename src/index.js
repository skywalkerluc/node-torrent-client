const path = require('path');
const tracker = require('./tracker');
const { open } = require('./torrent-parser');

const torrent = open(path.resolve(__dirname, '../public/puppy.torrent'));

tracker.getPeers(torrent, peers => {
  console.log(`List of peers: ${peers}`);
});