const JSDOMEnvironment = require('jest-environment-jsdom').default;
const { Buffer } = require('buffer');

class CustomJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    
    // Fix Buffer issue for esbuild
    this.global.Buffer = Buffer;
    
    // Ensure Uint8Array is properly set
    if (typeof this.global.Uint8Array === 'undefined') {
      this.global.Uint8Array = Uint8Array;
    }
  }
}

module.exports = CustomJSDOMEnvironment;
