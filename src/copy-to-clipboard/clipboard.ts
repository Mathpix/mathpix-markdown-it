function createNode(text: string): Element {
  const node = document.createElement('pre');
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.position = 'fixed';
  node.style.top = '5px';
  node.textContent = text;
  return node;
}

export function copyNode(node: Element): Promise<void> {
  const selection = getSelection();
  if (selection == null) {
    return Promise.reject(new Error())
  }

  selection.removeAllRanges();

  const range = document.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
  return Promise.resolve();
}

export function copyText(text: string): Promise<void> {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text)
  }
  const body = document?.body;
  if (!body) {
    return Promise.reject(new Error())
  }
  const node = createNode(text);
  body.appendChild(node);
  copyNode(node);
  body.removeChild(node);
  return Promise.resolve();
}
