const fs = require('fs');
const path = require('path');

class Blog {
  constructor(posts, defaultTemplate) {
    this.posts = posts;
    this.defaultTemplate = defaultTemplate;
  }
}

class Post {
  constructor(title, markdown, metadata, template) {
    this.title = title;
    this.markdown = markdown;
    this.metadata = metadata;
    this.template = template;
  }
}

class Template {
  constructor(html) {
    this.html = html;
  }
}

class BlogParser {

  static parse(
      blogDirectoryName,
      defaultTemplateFileName,
      postsDirectoryName,
      markdownFileName,
      metadataFileName,
      templateFileName) {
    BlogParser.checkPath(blogDirectoryName);
    const posts = BlogParser.parsePosts(
        blogDirectoryName,
        postsDirectoryName,
        markdownFileName,
        metadataFileName,
        templateFileName);
    const defaultTemplate = BlogParser.parseDefaultTemplate(
        blogDirectoryName,
        defaultTemplateFileName);
    return new Blog(posts, defaultTemplate);
  }

  static parsePosts(
      blogDirectoryName,
      postsDirectoryName,
      markdownFileName,
      metadataFileName,
      templateFileName) {
    const postsDirectoryPath = path.resolve(blogDirectoryName, postsDirectoryName);
    BlogParser.checkPath(postsDirectoryPath);

    const postDirectoryNames = fs.readdirSync(postsDirectoryPath);
    return postDirectoryNames
        .map(directory => BlogParser.parsePost(
            directory,
            postsDirectoryPath,
            markdownFileName,
            metadataFileName,
            templateFileName));
  }

  static parsePost(
      postDirectoryName,
      postsDirectoryPath,
      markdownFileName,
      metadataFileName,
      templateFileName) {
    const postDirectoryPath = path.resolve(postsDirectoryPath, postDirectoryName);
    BlogParser.checkPath(postDirectoryPath);

    const markdown = BlogParser.checkPathAndRead(postDirectoryPath, markdownFileName);
    const metadata = JSON.parse(BlogParser.checkPathAndRead(postDirectoryPath, metadataFileName));
    let template = null;
    try {
      template = new Template(BlogParser.checkPathAndRead(postDirectoryPath, templateFileName));
    } catch (error) {
      // Okay that there is no custom template, will fall back to using the default one.
    }

    return new Post(postDirectoryName, markdown, metadata, template);
  }

  static parseDefaultTemplate(blogDirectoryName, defaultTemplateFileName) {
    const defaultTemplateContents =
        BlogParser.checkPathAndRead(blogDirectoryName, defaultTemplateFileName);
    return new Template(defaultTemplateContents);
  }

  static checkPathAndRead(...components) {
    const entityPath = path.resolve(...components);
    BlogParser.checkPath(entityPath);
    return fs.readFileSync(entityPath).toString();
  }

  static checkPath(entityPath) {
    try {
      fs.accessSync(entityPath, fs.constants.R_OK);
    } catch (error) {
      throw new Error(`Path not accessible ${entityPath}`);
    }
  }
}

module.exports = BlogParser;
