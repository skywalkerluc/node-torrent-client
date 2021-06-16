const utils = require('../util');

test('Generate id tests', () => {
  const result = utils.generateId();

  expect(result).not.toBeNull();

  const generatingAgain = utils.generateId();
  expect(result).toEqual(generatingAgain);
});