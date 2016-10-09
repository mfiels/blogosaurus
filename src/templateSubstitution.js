const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const utils = require('./utils.js');

class TemplateSubstitution {

  constructor(templateDirectory, defaultTemplateFileName, postSelector) {
    this.templateDirectory = utils.getSlashTerminatedPath(templateDirectory);
    this.defaultTemplate = `${this.templateDirectory}${defaultTemplateFileName}`;
    this.postSelector = postSelector;
  }

  substitute(markdownFileName, html) {
    const templateFileName = this.getTemplateFileName(markdownFileName);
    if (!templateFileName) {
      throw new Error(`No template found for ${markdownFileName}`);
    }

    const templateFileContents = fs.readFileSync(templateFileName).toString();

    const $ = cheerio.load(templateFileContents);
    const postContainer = $(this.postSelector);
    if (!postContainer.length) {
      throw new Error(`No element in template ${templateFileName} matched selector ` +
          `${this.postSelector}`);
    }
    postContainer.append(html);

    return $.html();
  }

  getTemplateFileName(markdownFileName) {
    const markdownFile = path.parse(markdownFileName);
    const templateFile = `${this.templateDirectory}${markdownFile.name}.template.html`;
    try {
      fs.accessSync(templateFile, fs.constants.R_OK);
      console.info(`Using ${markdownFile} template at ${templateFile}`);
      return templateFile;
    } catch (error) {
      // The file doesn't exist, not a problem.
    }

    console.info(`Template file for ${markdownFileName} not found at ${templateFile}, ` +
        `using default template ${this.defaultTemplate}`);
    return this.defaultTemplate;
  }
}

module.exports = TemplateSubstitution;
