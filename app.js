const pug = require('pug');

// Compile the source code
const compiledFunction = pug.compileFile('./views/template.pug');

// Render a set of data
console.log(compiledFunction());
