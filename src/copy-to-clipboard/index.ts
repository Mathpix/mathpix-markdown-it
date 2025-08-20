import { copyText } from "./clipboard";
const CLIPBOARD_COPY_TIMER_DURATION = 2000;

const showSVG = (svg: HTMLElement) => {
  svg.style.display = 'inline-block';
};

const hideSVG = (svg: HTMLElement) => {
  svg.style.display = 'none';
};

export const clickInsideCopyElement = (e) => {
  let el = e.target;
  if (el.tagName === "CLIPBOARD-COPY") {
    return el;
  } else {
    let elParent = null;
    while (el = el.parentNode) {
      if (el.tagName === "CLIPBOARD-COPY") {
        elParent = el;
      }
    }
    return elParent;
  }
};

async function copy(button: HTMLElement) {
  const text = button.getAttribute('value');
  function trigger() {
    button.dispatchEvent(new CustomEvent('clipboard-copy', {bubbles: true}))
  }
  if (button.getAttribute('aria-disabled') === 'true') {
    return
  }
  if (text) {
    await copyText(text);
    trigger()
  }
}

export const clicked = (event) => {
  const button = clickInsideCopyElement(event);
  if (button instanceof HTMLElement) {
    copy(button);
  }
};

// Toggle a copy button.
const showCopy = (button) => {
  const [copyIcon, checkIcon] = button.querySelectorAll('.mmd-clipboard-icon');
  if (!copyIcon || !checkIcon)
    return;
  button.setAttribute('aria-label', 'Copy');
  showSVG(copyIcon);
  hideSVG(checkIcon);
};

// Toggle a copy button.
const showCheck = (button) => {
  const [copyIcon, checkIcon] = button.querySelectorAll('.mmd-clipboard-icon');
  if (!copyIcon || !checkIcon)
    return;
  button.setAttribute('aria-label', 'Copied');
  hideSVG(copyIcon);
  showSVG(checkIcon);
};

const handleClipboardCopy = (event) => {
  const el = event.target as HTMLElement;
  showCheck(el);
  setTimeout(function () {
    el.setAttribute('aria-label', '');
    showCopy(el);
  }, CLIPBOARD_COPY_TIMER_DURATION)
};

export const addListenerCopyToClipboardEvents = () => {
  document.addEventListener('click', clicked);
  document.addEventListener('clipboard-copy', handleClipboardCopy);
};

export const removeListenerCopyToClipboardEvents = () => {
  document.removeEventListener('click', clicked);
  document.removeEventListener('clipboard-copy', handleClipboardCopy)
};
