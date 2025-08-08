import * as Markdoc from '@markdoc/markdoc';

export function renderMarkdocToHtml(markdown: string): string {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast);
  // Render to HTML string. In pages, inject via dangerouslySetInnerHTML
  return Markdoc.renderers.html(content);
}
