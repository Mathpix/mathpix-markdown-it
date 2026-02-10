import { loadSreAsync } from "../sre/sre-browser";
import { addSpeechToMathContainer } from "../sre";

export interface MathpixSpeechConfig {
  /** Container element to process (defaults to document.body) */
  container?: HTMLElement;
}

const defaultConfig: MathpixSpeechConfig = {};

/**
 * Add speech attributes to already-rendered SVG math elements.
 * Use this when math was rendered server-side without accessibility (output_format: 'svg').
 *
 * This function:
 * - Loads SRE (Speech Rule Engine) dynamically
 * - Finds all mjx-container elements
 * - Extracts MathML from mjx-assistive-mml
 * - Generates speech text and adds aria-label
 *
 * @param container - The container element to search for math elements (defaults to document.body)
 */
export const addSpeechToRenderedMath = async (container?: HTMLElement): Promise<void> => {
  const root: HTMLElement = container ?? document.body;
  try {
    // Load SRE
    const sre = await loadSreAsync();
    if (!sre) {
      console.warn('[addSpeechToRenderedMath] SRE not available');
      return;
    }
    // Find all mjx-container elements (same approach as addAriaToMathHTML)
    const mathContainers: Element[] = Array.from(root.querySelectorAll('mjx-container'));

    for (const elMath of mathContainers) {
      addSpeechToMathContainer(sre, elMath, document);
    }
  } catch (err) {
    console.error('[addSpeechToRenderedMath] SRE processing error:', err);
  }
};

/**
 * Returns true when running in a browser environment (not SSR / Node).
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Read config from the global `window.MathpixSpeechConfig` if provided,
 * otherwise fall back to `defaultConfig`.
 */
const getGlobalConfig = (): MathpixSpeechConfig => {
  return ((window as any).MathpixSpeechConfig as MathpixSpeechConfig) || defaultConfig;
};

/**
 * Auto-add speech to rendered math elements.
 * This function is meant to be called once on page load.
 */
const autoAddSpeech = (): void => {
  const config: MathpixSpeechConfig = getGlobalConfig();
  const container: HTMLElement = config.container ?? document.body;
  addSpeechToRenderedMath(container).catch((err) => {
    console.error('[MathpixSpeech] autoAddSpeech failed:', err);
  });
};

// Auto-add speech on DOMContentLoaded (browser only).
if (isBrowser()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoAddSpeech, { once: true });
  } else {
    autoAddSpeech();
  }
  /**
   * Global API exposed for integrators (optional usage).
   * - `addSpeechToRenderedMath`: add speech to already-rendered SVG math
   */
  (window as any).MathpixSpeech = {
    addSpeechToRenderedMath
  };
}
