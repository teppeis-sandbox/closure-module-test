// import whilst from 'whilst';
const whilst = require('whilst');
const assert = require('assert');

let result = [];
let i = 0;
 
whilst(() => i < 3, () => {
  result.push(i);
  return Promise.resolve(i++);
}).then(finalResult => {
  assert.deepEqual(result, [0, 1, 2]);
  assert.equal(finalResult, 2);
});

export default 'bar';
