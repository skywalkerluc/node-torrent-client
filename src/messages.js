const Buffer = require('buffer').Buffer;
const torrentParser = require('./torrent-parser');

const buildHandshake = (torrent) => {
  console.log(torrent, 'torrentMounted');
}

const buildKeepAlive = () => {
  Buffer.alloc(4);
}

module.exports = {
  buildHandshake,
  buildKeepAlive
}