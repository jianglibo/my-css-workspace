const fs = require('fs');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const cssnano = require('cssnano'); // For minification
const yargs = require('yargs'); // For command-line argument parsing

const namespace = '.cjj365 '; // The namespace to prepend

// Function to prepend namespace to selectors
function prependNamespaceToSelector() {
  return (root) => {
    root.walkRules((rule) => {
      rule.selector = selectorParser((selectors) => {
        selectors.each((selector) => {
          // Prepend the namespace to each selector
          selector.prepend(selectorParser.className({ value: namespace.slice(1) }));
        });
      }).processSync(rule.selector);
    });
  };
}

// Load the input CSS, process it, and save the output
async function processCss(inputFile, outputFile, minify) {
  const inputCss = fs.readFileSync(inputFile, 'utf8');

  let plugins = [prependNamespaceToSelector()];

  // If minify flag is true, add cssnano to the plugins
  if (minify) {
    plugins.push(cssnano()); // Minify the CSS
  }

  const result = await postcss(plugins).process(inputCss, { from: inputFile });

  fs.writeFileSync(outputFile, result.css);
  console.log(`CSS processed and written to ${outputFile}`);
}

// Get command-line arguments
const argv = yargs
  .option('minify', {
    alias: 'm',
    type: 'boolean',
    description: 'Minify the output CSS',
    default: false,
  })
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'Input CSS file path',
    default: 'source/input.css',
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output CSS file path',
    default: 'dist/output.css',
  })
  .argv;

// Input and output file paths
// const inputFile = __dirname + '/input.css';
// const outputFile = 'output.css';
// if parent of output file does not exist, create it

// Process the CSS with or without minification
processCss(argv.input, argv.output, argv.minify);


// const fs = require('fs');
// const postcss = require('postcss');
// const selectorParser = require('postcss-selector-parser');

// const namespace = '.cjj365 '; // The namespace to prepend

// // Function to prepend namespace to selectors
// function prependNamespaceToSelector() {
//   return (root) => {
//     root.walkRules((rule) => {
//       rule.selector = selectorParser((selectors) => {
//         selectors.each((selector) => {
//           // Prepend the namespace to each selector
//           selector.prepend(selectorParser.className({ value: namespace.slice(1) }));
//         });
//       }).processSync(rule.selector);
//     });
//   };
// }

// // Load the input CSS, process it, and save the output
// async function processCss(inputFile, outputFile) {
//   const inputCss = fs.readFileSync(inputFile, 'utf8');

//   const result = await postcss([prependNamespaceToSelector()])
//     .process(inputCss, { from: inputFile });

//   fs.writeFileSync(outputFile, result.css);
//   console.log(`CSS processed and written to ${outputFile}`);
// }
// // current directory
// console.log(__dirname);

// // working dir
// console.log(process.cwd());

// // Input and output file paths
// const inputFile = __dirname + '/input.css';
// const outputFile = 'output.css';

// processCss(inputFile, outputFile);
