import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';

export class WolframVisitor extends MmlVisitor {
  options = null;

  constructor(options) {
    super();
    this.options = options
  }
}