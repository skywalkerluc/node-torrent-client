const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const { URL } = require('url');

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

}

const parseConnectionResponse = (response) => {

}

const buildAnnouncement = (connectionId) => {

}

module.exports = {
  getPeers,
}