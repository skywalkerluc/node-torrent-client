const bencode = require('bencode');
const { open, size, infoHash } = require('../torrent-parser');
const path = require('path');

jest.mock('bencode');
jest.mock('crypto');

describe('torrent-parser scenarios', () => {
  test('open function should trigger bencode.decode ', () => {
    const expectedValue = { data: { bar: 'foo'}};
    bencode.decode.mockImplementation(() => expectedValue);

    const torrent = open(path.resolve(__dirname, '../../public/puppy.torrent'));
    expect(torrent).toEqual(expectedValue);
    expect(bencode.decode).toHaveBeenCalled();
  });

  test('size function should return torrent size for multiple files', () => {
    const inputTorrent = {
      info: {
        files: [
          { content: { foo: 'bar' }, length: 2212000 },
          { content: { foo: 'bard' }, length: 2211000 },
        ]
      }
    }

    const expected = {
      data: [0, 0, 0, 0, 0, 67, 125, 88], type: "Buffer"
    };

    const result = size(inputTorrent);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toJSON()).toEqual(expected);
  });

  test('size function should return torrent size for a single file', () => {
    const inputTorrent = {
      info: {
        content: { foo: 'bar' }, length: 2212000
      }
    }

    const expected = {
      data: [0, 0, 0, 0, 0, 33, 192, 160], type: "Buffer"
    };

    const result = size(inputTorrent);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toJSON()).toEqual(expected);
  });

  test('infoHash function should trigger crypto create hash', () => {
    // to try later
  });
});