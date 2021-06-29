const Buffer = require('buffer').Buffer;
const torrentParser = require('./torrent-parser');
const util = require('./util');

const buildHandshake = (torrent) => {
  const buff = Buffer.alloc(68);
  buff.writeUInt8(19, 0);
  buff.write('BitTorrent protocol', 1);

  buff.writeUInt32BE(0, 20);
  buff.writeUInt32BE(0, 24);

  torrentParser.infoHash(torrent).copy(buff, 28);

  buff.write(util.generateId());
  return buff;
}

const buildKeepAlive = () => {
  Buffer.alloc(4);
}

const buildChoke = () => {
  const buff = Buffer.alloc(5);
  buff.writeUInt32BE(1, 0);
  buff.writeUInt8(0, 4);

  return buff;
}

const buildUnchoke = () => {
  const buff = Buffer.alloc(5);

  buff.writeUInt32BE(1, 0);
  buff.writeUInt8(1, 4);

  return buff;
};

const buildInterested = () => {
  const buff = Buffer.alloc(5);

  buff.writeUInt32BE(1, 0);
  buff.writeUInt8(2, 4);

  return buff;
};

const buildUninterested = () => {
  const buff = Buffer.alloc(5);

  buff.writeUInt32BE(1, 0);
  buff.writeUInt8(3, 4);

  return buff;
};

const buildHave = payload => {
  const buff = Buffer.alloc(9);

  buff.writeUInt32BE(5, 0);
  buff.writeUInt8(4, 4);
  buff.writeUInt32BE(payload, 5);

  return buf;
};

const buildBitfield = (bitfield, payload) => {
  const buff = Buffer.alloc(14);

  buff.writeUInt32BE(payload.length + 1, 0);
  buff.writeUInt8(5, 4);
  bitfield.copy(buff, 5);

  return buff;
};

const buildRequest = payload => {
  const buff = Buffer.alloc(17);

  buff.writeUInt32BE(13, 0);
  buff.writeUInt8(6, 4);
  buff.writeUInt32BE(payload.index, 5);
  buff.writeUInt32BE(payload.begin, 9);
  buff.writeUInt32BE(payload.length, 13);

  return buff;
};

const buildPiece = payload => {
  const buff = Buffer.alloc(payload.block.length + 13);

  buff.writeUInt32BE(payload.block.length + 9, 0);
  buff.writeUInt8(7, 4);
  buff.writeUInt32BE(payload.index, 5);
  buff.writeUInt32BE(payload.begin, 9);
  payload.block.copy(buff, 13);

  return buff;
};

const buildCancel = payload => {
  const buff = Buffer.alloc(17);

  buff.writeUInt32BE(13, 0);
  buff.writeUInt8(8, 4);
  buff.writeUInt32BE(payload.index, 5);
  buff.writeUInt32BE(payload.begin, 9);
  buff.writeUInt32BE(payload.length, 13);

  return buff;
};

const buildPort = payload => {
  const buff = Buffer.alloc(7);

  buff.writeUInt32BE(3, 0);
  buff.writeUInt8(9, 4);
  buff.writeUInt16BE(payload, 5);

  return buff;
};


module.exports = {
  buildHandshake,
  buildKeepAlive,
  buildChoke,
  buildUnchoke,
  buildInterested,
  buildUninterested,
  buildHave,
  buildBitfield,
  buildRequest,
  buildPiece,
  buildCancel,
  buildPort
}