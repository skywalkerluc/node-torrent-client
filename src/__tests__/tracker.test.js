const tracker = require('../tracker');
const buffer = require('buffer').Buffer;
const faker = require('faker');

const { URL } = require('url');


afterEach(() => {
  if(global.gc) {
    global.gc();
  }
})

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
});
