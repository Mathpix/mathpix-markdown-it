
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
      const elMath = mathEls[i];
      const elMml = elMath 
        ? elMath.querySelector('mjx-assistive-mml') 
        : null;
      
      if(!elMml) {
        continue;
      }

      const speech = getSpeech(sre, elMml.innerHTML);
      elMml.setAttribute('aria-hidden', "true");
      if (!speech) {
        continue;
      }

      elMath.setAttribute('aria-label', speech);
      elMath.setAttribute('role', "math");
      elMath.setAttribute('tabindex', '0');
      
      const elSpeech = doc.createElement('speech');
      elSpeech.innerHTML = speech;
      elSpeech.style.display = "none";
      elMath.parentElement.appendChild(elSpeech);
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.error('ERROR=>[addAriaToMathHTML]=>' + err);
    return html;
  }
};
