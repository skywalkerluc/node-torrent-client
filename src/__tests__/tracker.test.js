const tracker = require('../tracker');
const buffer = require('buffer').Buffer;

test('parseConnectionResponse should return action, transaction and connection', () => {
  const buff = buffer.alloc(16);
  const response = tracker.parseConnectionResponse(buff);

  expect(response).not.toBeNull();
  expect(response).toHaveProperty('action');
  expect(response).toHaveProperty('transactionId');
  expect(response).toHaveProperty('connectionId');
});