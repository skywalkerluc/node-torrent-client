const fs = require('fs');
const bignum = require('bignum');
const { decode } = require('bencode');

const open = (filepath) => {
  return decode(fs.readFileSync(filepath));
}

const size = torrent => {
  const size = torrent.info.files ?
    torrent.info.files.map(file => file.length).reduce((a, b) => a + b) :
    torrent.info.length;

  return bignum.toBuffer(size, { size: 8});
}

const infoHash = torrent => {
  const info = decode(torrent.info);
  return crypto.createHash('sha1').update(info).digest(); // sha1 is being used at bittorrent and got fixed length
}

module.exports = {
  open,
  size,
  infoHash
}