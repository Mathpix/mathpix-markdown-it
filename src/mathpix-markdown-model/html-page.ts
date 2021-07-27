export const generateHtmlPage = (title, previewHtml, styles='', fonts='') => {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${fonts}
    ${styles}
</head>
<body>
  <div id="preview" class="preview scrollEditor">
    <div id="container-ruller" />
    <div id="preview-content">
      ${previewHtml}
    </div>
  </div>
</body>
</html>`
};
