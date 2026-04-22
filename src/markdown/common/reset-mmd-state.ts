import { resetTextCounter } from '../mdPluginText';
import { resetTheoremEnvironments } from '../md-theorem/helper';
import { rest_mmd_footnotes_list } from '../md-latex-footnotes/utils';
import { clearSlugsTocItems } from '../mdPluginTOC';
import { ClearParseErrorList } from '../md-block-rule/parse-error';
import { clearLabelsList } from './labels';
import { clearItemizeLevelTokens } from '../md-latex-lists-env/re-level';
import { resetListState } from '../md-latex-lists-env/list-state';
import { resetSizeCounter } from './counters';
import { MathJax } from '../../mathjax';

/** Reset per-parse module-level state. Auto-invoked at parse start via the
 *  reset_mmd_global_state core-ruler hook; export exists for one-shot
 *  converters to release state after render. */
export const resetMmdGlobalState = (): void => {
  clearSlugsTocItems();
  ClearParseErrorList();
  resetTheoremEnvironments();
  clearLabelsList();
  rest_mmd_footnotes_list();
  clearItemizeLevelTokens();
  resetListState();
  resetTextCounter();
  resetSizeCounter();
  MathJax.Reset();
};
