const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const utils = require('./utils.js');

class BlogWriter {

  constructor(renderer, outputDirectory) {
    this.renderer = renderer;
    this.outputDirectory = utils.getSlashTerminatedPath(outputDirectory);
  }

  write(blog) {
    blog.posts.forEach((post) => {
      this.writePost(blog, post);
    });
  }

  writePost(blog, post) {
    const renderedHtml = this.renderer.render(post.markdown);
    const template = post.template ? post.template.html : blog.defaultTemplate.html;

    const data = Object.assign({
      title: post.title,
      'bs-post': renderedHtml,
    }, post.metadata);
    const templatedHtml = handlebars.compile(template)(data);

    const outputFileName = path.resolve(this.outputDirectory, `${post.title}.html`);
    console.info(`Writing ${post.title} -> ${outputFileName}`);
    fs.writeFileSync(outputFileName, templatedHtml);
  }
}

module.exports = BlogWriter;
