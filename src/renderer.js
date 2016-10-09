const highlight = require('highlight.js');
const markdown = require('markdown-it');
const markdownAttrs = require('markdown-it-attrs');

/**
 * Renders markdown (with attribute support extension) to HTML.
 */
class Renderer {

  constructor() {
    const renderer = markdown({ highlight: Renderer.highlightCode });
    renderer.use(markdownAttrs);
    this.renderer = renderer;
  }

  render(markdownString) {
    return this.renderer.render(markdownString);
  }

  /**
   * Pass code blocks through highlight.js.
   */
  static highlightCode(string, language) {
    if (!language || !highlight.getLanguage(language)) {
      return '';
    }

    try {
      return highlight.highlight(language, string).value;
    } catch (error) {
      console.error(`Failed to highlight markdown ${language}, ${string}`, error);
      return '';
    }
  }
}

module.exports = Renderer;
