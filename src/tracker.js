const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const URL = require('url').parse;
const crypto = require('crypto');
const torrentParser = require('./torrent-parser');
const { generateId } = require('./util');

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4');
  const url = URL(torrent.announce.toString('utf-8'));

  udpSend(socket, buildConnection(), url);

  socket.on('message', response => {
    if(responseType(response) === 'connect') {
      const connectionResponse = parseConnectionResponse(response);
      const announceRequest = buildAnnouncement(connectionResponse.connectionId, torrent);
      udpSend(socket, announceRequest, url);
    }

    if(responseType(response) === 'announce') {
      const announceResponse = parseAnnounceResponse(response);
      callback(announceResponse.peers);
    }
  });
}

const udpSend = (socket, message, rawUrl, callback = () => {}) => {
  const url = URL(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

const responseType = (response) => {
  const action = response.readUInt32BE(0);
  if (action === 0) return 'connect';
  if (action === 1) return 'announce';
}

const buildConnection = () => {
  const buffer = Buffer.alloc(16);

  // connection id
  buffer.writeUInt32BE(0x417, 0);
  buffer.writeUInt32BE(0x27101980, 4);

  // action
  buffer.writeUInt32BE(0, 8);

  // transaction id
  crypto.randomBytes(4).copy(buffer, 12);
  return buffer;
}

const parseConnectionResponse = (response) => {
  try {
    return {
      action: response.readUInt32BE(0),
      transactionId: response.readUInt32BE(4),
      connectionId: response.slice(8)
    }
  } catch (error) {
    return false;
  }
}

const buildAnnouncement = (connectionId, torrent, port=6881) => {
  const buff = Buffer.allocUnsafe(98);

  // mounting announce req
  connectionId.copy(buff, 0);
  buff.writeUInt32BE(1, 8);
  crypto.randomBytes(4).copy(buff, 12); // transactionId
  torrentParser.infoHash(torrent).copy(buff, 16);
  generateId().copy(buff, 36); // peer id
  Buffer.alloc(8).copy(buff, 56);
  torrentParser.size(torrent).copy(buff, 64);
  Buffer.alloc(8).copy(buff, 72);
  buff.writeUInt32BE(0, 80); // event
  buff.writeUInt32BE(0, 80);
  crypto.randomBytes(4).copy(buf, 88); // key
  buff.writeInt32BE(-1, 92);
  buff.writeUInt16BE(port, 96); // port gotta be between 6881 and 6889

  return buff;
}

const parseAnnounceResponse = (response) => {
  console.log(response, 'announce response');
  const group = (iterable, groupSize) => {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  };

  return {
    action: response.readUInt32BE(0),
    transactionId: response.readUInt32BE(4),
    leechers: response.readUInt32BE(8),
    seeders: response.readUInt32BE(12),
    peers: group(response.slice(20), 6).map(address => {
      return {
        ip: address.slice(0, 4).join('.'),
        port: address.readUInt16BE(4)
      }
    })
  };
}

module.exports = {
  getPeers,
  udpSend,
  parseAnnounceResponse,
  responseType,
  buildConnection,
  parseConnectionResponse,
  buildAnnouncement
}