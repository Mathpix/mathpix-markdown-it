export const isFirstChild = (node): boolean => {
  return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};

export const isLastChild = (node): boolean => {
  return node.parent && node.parent.childNodes
    && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
