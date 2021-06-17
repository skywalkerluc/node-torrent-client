const tracker = require('../tracker');
const buffer = require('buffer').Buffer;
const faker = require('faker');

afterEach(() => {
  if(global.gc) {
    global.gc();
  }
})

describe('parseConnectionResponse scenarios', () => {
  test('parseConnectionResponse should return action, transaction and connection', () => {
    const buff = buffer.alloc(16);
    const response = tracker.parseConnectionResponse(buff);

    expect(response).not.toBeNull();
    expect(response).toHaveProperty('action');
    expect(response).toHaveProperty('transactionId');
    expect(response).toHaveProperty('connectionId');
  });

  test('parseConnectionResponse should return false if no valid response is provided', () => {
    const buff = buffer.alloc(2);
    const response = tracker.parseConnectionResponse(buff);

    expect(response).toBeFalsy();
    expect(response).not.toHaveProperty('action');
    expect(response).not.toHaveProperty('transactionId');
    expect(response).not.toHaveProperty('connectionId');
  });
});

describe('udpSend scenarios', () => {
  test('udpSend should call socket.send ', () => {
    const mockRequest = {
      socket: {
        send: jest.fn()
      },
      message: 'example message',
      rawUrl: faker.internet.url()
    };

    tracker.udpSend(mockRequest.socket, mockRequest.message, mockRequest.rawUrl, () => {});

    expect(mockRequest.socket.send).toHaveBeenCalled();
    // expect(mockRequest.socket.send).toHaveBeenCalledWith();
  });
});

describe('Build connection', () => {
  test('should return a 16-length buffer', () => {
    const result = tracker.buildConnection();
    expect(result.length).toEqual(16);
    expect(result).toBeInstanceOf(Buffer);
  });
});

describe('Response Type', () => {
  test('should return connect if action has value 0', () => {
    const buff = buffer.alloc(16);
    const result = tracker.responseType(buff);

    expect(result).toEqual('connect');
  });

  test('should return announce if action has value 1', () => {
    const buff = buffer.alloc(16);
    buff.writeUInt32BE(1, 0);
    const result = tracker.responseType(buff);

    expect(result).toEqual('announce');
  });

  test('should return undefined if action has value different from 0 or 1', () => {
    const buff = buffer.alloc(16);
    buff.writeUInt32BE(9, 0);
    const result = tracker.responseType(buff);

    expect(result).toBeUndefined();
  });
});