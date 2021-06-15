const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const { URL } = require('url');
const crypto = require('crypto');

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4');
  const url = URL(torrent.announce.toString('utf-8'));


  udpSend(socket, buildConnection(), url);

  socket.on('message', response => {
    if(responseType(response) === 'connect') {
      const connectionResponse = parseConnectionResponse(response);
      const announceRequest = buildAnnouncement(connectionResponse.connectionId);
      udpSend(socket, announceRequest, url);
    }

    if(responseType(response) === 'announce') {
      const announceResponse = parseAnnounceResponse(response);
      callback(announceResponse.peers);
    }
  });
}

const udpSend = (udpRequest, callback = () => {}) => {
  const { socket, message, rawUrl } = udpRequest;
  const url = URL(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

const parseAnnounceResponse = (response) => {

}

const responseType = (response) => {

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
  return {
    action: response.readUInt32BE(0),
    transactionId: response.readUInt32BE(4),
    connectionId: response.slice(8)
  }
}

const buildAnnouncement = (connectionId) => {

}

module.exports = {
  getPeers,
}