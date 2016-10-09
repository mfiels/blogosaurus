const fs = require('fs');
const path = require('path');
const utils = require('./utils.js');

class HtmlWriter {

  constructor(renderer, templateSubstitution, outputDirectory) {
    this.renderer = renderer;
    this.templateSubstitution = templateSubstitution;
    this.outputDirectory = utils.getSlashTerminatedPath(outputDirectory);
  }

  write(markdownFileName) {
    const markdownContent = fs.readFileSync(markdownFileName).toString();
    const markdownHtml = this.renderer.render(markdownContent);
    const html = this.templateSubstitution.substitute(markdownFileName, markdownHtml);
    const htmlFileName = this.getHtmlFileName(markdownFileName);

    console.log(`Writing ${markdownFileName} -> ${htmlFileName}...`);
    fs.writeFileSync(`${htmlFileName}`, html);
  }

  getHtmlFileName(markdownFileName) {
    return `${this.outputDirectory}${path.parse(markdownFileName).name}.html`;
  }
}

module.exports = HtmlWriter;
