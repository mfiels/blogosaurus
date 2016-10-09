const mkdirp = require('mkdirp');
const argv = require('optimist')
    .default('o', false)
    .default('t', './')
    .default('d', 'default.template.html')
    .default('p', '.bs-post')
    .argv;

const HtmlWriter = require('./src/htmlWriter.js');
const Renderer = require('./src/renderer.js');
const TemplateSubstitution = require('./src/templateSubstitution.js');

if (argv.o) {
  mkdirp.sync(argv.o);
}

const writer = new HtmlWriter(
    new Renderer(),
    new TemplateSubstitution(argv.t, argv.d, argv.p),
    argv.o);

argv._.forEach((markdownFileName) => {
  writer.write(markdownFileName);
});
