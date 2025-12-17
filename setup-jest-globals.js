// Setup global Buffer before jest-preset-angular loads
const { Buffer } = require('buffer');
global.Buffer = Buffer;

// Ensure Uint8Array prototype chain is correct
if (typeof global.Uint8Array !== 'undefined') {
  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
}
