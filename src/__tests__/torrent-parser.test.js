const { open, size, infoHash } = require('../torrent-parser');
const path = require('path');

describe('torrent-parser scenarios', () => {
  test('open function should trigger bencode.decode ', () => {
    const torrent = open(path.resolve(__dirname, '../../public/puppy.torrent'));

  });

  test('size function should return torrent size', () => {

  });

  test('infoHash function should trigger crypto create hash', () => {

  });
});