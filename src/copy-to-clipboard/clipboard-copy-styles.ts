import {
  COLOR_CLIPBOARD_TEXT, COLOR_CLIPBOARD_BG, COLOR_CLIPBOARD_BORDER,
  COLOR_CLIPBOARD_SHADOW, COLOR_CLIPBOARD_SHADOW_INSET,
  COLOR_CLIPBOARD_HOVER_BG, COLOR_CLIPBOARD_COPY_ICON, COLOR_CLIPBOARD_CHECK_ICON,
} from "../styles/colors";

export const clipboardCopyStyles = () => `
    .ClipboardButton {
        padding: 0;
        margin: 0.5rem;
        display: inline-block;
        cursor: pointer;
        color: ${COLOR_CLIPBOARD_TEXT};
        background: ${COLOR_CLIPBOARD_BG};
        border-radius: 6px;
        border: 1px solid ${COLOR_CLIPBOARD_BORDER};
        box-shadow: ${COLOR_CLIPBOARD_SHADOW} 0 1px 0 0, ${COLOR_CLIPBOARD_SHADOW_INSET} 0 1px 0 0 inset;
        position: relative;
    }
    .ClipboardButton:hover {
        background-color: ${COLOR_CLIPBOARD_HOVER_BG};
        border-color: ${COLOR_CLIPBOARD_BORDER};
        transition-duration: .1s;
    }
    td .mmd-clipboard-copy-container {
        line-height: 0;
    }
    td .ClipboardButton {
        margin: 1px;
        line-height: 0;
    }
    td .ClipboardButton .mmd-clipboard-icon {
        margin: 1px !important;
        transform: scale(0.6);
    }
    .mmd-clipboard-icon {
        fill: currentColor;
        vertical-align: text-bottom;
    }
    .mmd-clipboard-copy-icon {
        color: ${COLOR_CLIPBOARD_COPY_ICON};
    }
    .mmd-clipboard-check-icon {
        color: ${COLOR_CLIPBOARD_CHECK_ICON};
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
        border-left-color: ${COLOR_CLIPBOARD_TEXT};
    }
    .mmd-tooltipped::before {
        position: absolute;
        z-index: 1000001;
        display: none;
        width: 0;
        height: 0;
        color: ${COLOR_CLIPBOARD_TEXT};
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
        color: white;
        text-align: center;
        text-decoration: none;
        text-shadow: none;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: break-word;
        white-space: pre;
        pointer-events: none;
        content: attr(aria-label);
        background: ${COLOR_CLIPBOARD_TEXT};
        border-radius: 6px;
        opacity: 0;
    }
`;
