
/**
 * TODO: Add a handler to reader output "softmax" as a word instead of "s o f t m a x"
 * */
export const getSpeech = (sre, mml): string => {
  try {
    return sre.toSpeech(mml);
  } catch (err) {
    console.error('ERROR=>[getSpeech]=>' + err);
    return '';
  }
};

/**
 * Process a single mjx-container element to add speech accessibility.
 *
 * @param sre - Speech Rule Engine instance
 * @param elMath - The mjx-container element
 * @param doc - Document object for creating elements (pass `document` in browser)
 */
export const addSpeechToMathContainer = (
  sre: any,
  elMath: Element,
  doc: Document
): void => {
  // Skip if already has aria-label
  if (elMath.hasAttribute('aria-label')) return;
  // Find assistive MathML element
  const elMml = elMath.querySelector('mjx-assistive-mml');
  if (!elMml) return;
  const speech: string = getSpeech(sre, elMml.innerHTML);
  if (!speech) return;
  // Set accessibility attributes
  elMath.setAttribute('aria-label', speech);
  elMath.setAttribute('role', 'math');
  elMath.setAttribute('tabindex', '0');
  elMath.removeAttribute('aria-labelledby');
  // Add hidden speech element for context menu
  const elSpeech = doc.createElement('speech');
  elSpeech.textContent = speech;
  elSpeech.style.display = 'none';
  const parent = elMath.parentElement;
  if (parent) {
    parent.appendChild(elSpeech);
  } else {
    console.warn('[addSpeechToMathContainer] mjx-container has no parentElement — speech element not appended');
  }
};

export const addAriaToMathHTML = (sre, html: string) => {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const mathEls = doc
      ? doc.querySelectorAll('mjx-container')
      : null;

    if (!mathEls || !mathEls.length) {
      return html;
    }

    for (let i = 0; i < mathEls.length; i++) {
      addSpeechToMathContainer(sre, mathEls[i], doc);
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.error('ERROR=>[addAriaToMathHTML]=>' + err);
    return html;
  }
};
