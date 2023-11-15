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
  button.classList.remove('mmd-tooltipped');
  button.classList.remove('mmd-tooltipped-w');
  showSVG(copyIcon);
  hideSVG(checkIcon);
};

// Toggle a copy button.
const showCheck = (button) => {
  const [copyIcon, checkIcon] = button.querySelectorAll('.mmd-clipboard-icon');
  if (!copyIcon || !checkIcon)
    return;
  button.setAttribute('aria-label', 'Copied');
  button.classList.add('mmd-tooltipped');
  button.classList.add('mmd-tooltipped-w');
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

export const focused = (event: FocusEvent) => {
  // console.log("[MMD]=>focused=>event=>", event);
  // console.log("[MMD]=>focused=>event.currentTarget=>", event.currentTarget);
};

export const blurred = () => {
  // console.log("[MMD]=>blurred=>event=>", event);
  // console.log("[MMD]=>blurred=>event.currentTarget=>", event.currentTarget);
};

export const addListenerCopyToClipdoardEvents = () => {
  document.addEventListener('click', clicked);
  document.addEventListener('focus', focused);
  document.addEventListener('blur', blurred);
  document.addEventListener('clipboard-copy', handleClipboardCopy);
};

export const removeListenerCopyToClipdoardEvents = () => {
  document.removeEventListener('click', clicked);
  document.removeEventListener('focus', focused);
  document.removeEventListener('blur', blurred);
  document.removeEventListener('clipboard-copy', handleClipboardCopy)
};
