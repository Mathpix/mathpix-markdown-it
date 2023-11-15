export const clipboardCopyStyles = () => `
.ClipboardButton {
  padding: 0;
  margin: 0.5rem;
  display: inline-block;
  cursor: pointer;
  color: rgb(36, 41, 47);
  background: rgb(246, 248, 250);
  border-radius: 6px;
  border: 1px solid rgba(31, 35, 40, 0.15);
  box-shadow: rgba(31, 35, 40, 0.04) 0 1px 0 0, rgba(255, 255, 255, 0.25) 0 1 0 0 inset;
  position: relative;
}

.ClipboardButton:hover {
  background-color: rgb(243, 244, 246);
  border-color rgba(31, 35, 40, 0.15);
  transition-duration: .1s;
}

.mmd-clipboard-icon {
  fill: currentColor;
  vertical-align: text-bottom;
}

.mmd-clipboard-copy-icon {
  color: rgb(101, 109, 118);
}
.mmd-clipboard-check-icon {
  color: rgb(26, 127, 55);
}

.mmd-tooltipped-no-delay:hover::before,
.mmd-tooltipped-no-delay:hover::after {
  animation-delay: 0s;
}

.mmd-tooltipped:hover::before,
.mmd-tooltipped:hover::after {
  display: inline-block;
  text-decoration: none;
  animation-name: tooltip-appear;
  animation-duration: .1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
  animation-delay: .4s;
}

.mmd-tooltipped-w::before {
  top: 50%;
  bottom: 50%;
  left: -7px;
  margin-top: -6px;
  border-left-color: rgb(36, 41, 47)
}

.mmd-tooltipped::before {
  position: absolute;
  z-index: 1000001;
  display: none;
  width: 0;
  height: 0;
  color: rgb(36, 41, 47)
  pointer-events: none;
  content: "";
  border: 6px solid transparent;
  opacity: 0;
}

.mmd-tooltipped-w::after {
  right: 100%;
  bottom: 50%;
  margin-right: 6px;
  transform: translateY(50%);
}


.mmd-tooltipped::after {
    position: absolute;
    z-index: 1000000;
    display: none;
    padding: 0.5em 0.75em;
    font: normal normal 11px/1.5 'CMU Serif', 'Georgia', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: subpixel-antialiased;
    color: rgb(255, 255, 255);
    text-align: center;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: break-word;
    white-space: pre;
    pointer-events: none;
    content: attr(aria-label);
    background: rgb(36, 41, 47);
    border-radius: 6px;
    opacity: 0;
}
`;
