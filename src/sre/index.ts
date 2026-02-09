
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
 * Returns true if speech was added, false otherwise.
 *
 * @param sre - Speech Rule Engine instance
 * @param elMath - The mjx-container element
 */
export const addSpeechToMathContainer = (
  sre: any,
  elMath: Element
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
  const elSpeech = document.createElement('speech');
  elSpeech.innerHTML = speech;
  elSpeech.style.display = 'none';
  elMath.parentElement?.appendChild(elSpeech);
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
      addSpeechToMathContainer(sre, mathEls[i]);
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.error('ERROR=>[addAriaToMathHTML]=>' + err);
    return html;
  }
};
