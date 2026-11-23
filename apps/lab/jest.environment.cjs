// jsdom does not expose structuredClone. Keep the real Node implementation in
// the browser test realm so snapshot tests exercise deep copying, not a mock.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {TestEnvironment} = require('jest-environment-jsdom');
const nativeStructuredClone = globalThis.structuredClone;

module.exports = class BrowserTestEnvironment extends TestEnvironment {
    async setup() {
        await super.setup();
        if (typeof nativeStructuredClone !== 'function') {
            throw new Error('Tests require a Node runtime with native structuredClone');
        }
        this.global.structuredClone = nativeStructuredClone;
    }
};
