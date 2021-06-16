const fs = require('fs');
const { decode } = require('bencode');

const open = (filepath) => {
  return decode(fs.readFileSync(filepath));
}

const size = torrent => {
  // no implementation so far
}

const infoHash = torrent => {
  // no implementation so far
}

module.exports = {
  open,
  size,
  infoHash
}