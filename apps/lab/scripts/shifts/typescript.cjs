const fs = require('node:fs');
const ts = require('typescript');

function compile(text) {
  return ts.transpileModule(text, {compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true,
  }}).outputText;
}
require.extensions['.ts'] = (module, path) => module._compile(compile(fs.readFileSync(path, 'utf8')), path);
module.exports = compile;
