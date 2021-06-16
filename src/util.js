const crypto = require('crypto');

let id = null;

const generateId = () => {
  if(!id) {
    id = crypto.randomBytes(20);
    Buffer.from('-LT0001-').copy(id, 0); // Lukin-torrent-v1
  }
  return id;
}

module.exports = {
  generateId
}