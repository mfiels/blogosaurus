require('babel-polyfill');

const mkdirp = require('mkdirp');
const argv = require('optimist')
    .default('o', false)
    .default('b', './blog')
    .default('p', 'posts')
    .default('t', 'post.template.html')
    .default('d', 'default.template.html')
    .default('m', 'post.md')
    .default('e', 'metadata.json')
    .argv;

const BlogParser = require('./src/blogParser.js');
const BlogWriter = require('./src/blogWriter.js');
const Renderer = require('./src/renderer.js');

if (!argv.o) {
  console.error('Must specify an output directory with -o');
  process.exit(1);
}

mkdirp.sync(argv.o);

const blog = BlogParser.parse(argv.b, argv.d, argv.p, argv.m, argv.e, argv.t);
const writer = new BlogWriter(new Renderer(), argv.o);
writer.write(blog);
