const net = require('net');
const Buffer = require('buffer').Buffer;
const message = require('./messages');
const tracker = require('./tracker');

module.exports = torrent => {
  tracker.getPeers(torrent, peers => {
    peers.forEach(peer => download(peer, torrent));
  });
}

const download = (peer, torrent) => {
  const socket = net.Socket();
  socket.on('error', console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(message.buildHandshake(torrent));
  });

  onWholeMessage(socket, msg => {
    messageHandler(msg, socket);
  });
}

const messageHandler = (msg, socket) => {
  if(isHandshake(msg)) socket.write(message.buildInterested());
}

const isHandshake = msg => {
  return msg.length === msg.readUInt8(0) + 49 &&
    msg.toString('utf-8', 1) === 'BitTorrent protocol';
}

const onWholeMessage = (socket, callback) => {
  let savedBuffer = Buffer.alloc(0);
  let handshake = true;

  socket.on('data', receivedBuffer => {
    const msgLength = () => handshake ?
      savedBuffer.readUInt8(0) + 49 :
      savedBuffer.readUInt32BE(0) + 4;

    savedBuffer = Buffer.concat([savedBuffer, receivedBuffer]);

    while(savedBuffer.length >= 4 && savedBuffer.length >= msgLength()){
      callback(savedBuffer.slice(0, msgLength()));
      savedBuffer = savedBuffer.slice(msgLength());
      handshake = false;
    }
  });
}