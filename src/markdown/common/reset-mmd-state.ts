import { resetTextCounter } from '../mdPluginText';
import { resetTheoremEnvironments } from '../md-theorem/helper';
import { rest_mmd_footnotes_list } from '../md-latex-footnotes/utils';
import { clearSlugsTocItems } from '../mdPluginTOC';
import { ClearParseErrorList } from '../md-block-rule/parse-error';
import { clearLabelsList } from './labels';
import { clearItemizeLevelTokens } from '../md-latex-lists-env/re-level';
import { resetListState } from '../md-latex-lists-env/list-state';
import { resetListRenderDepth } from '../md-latex-lists-env/render-latex-list-env';
import { resetEnvSnapshotPool } from './env-transient';
import { resetSizeCounter } from './counters';
import { MathJax } from '../../mathjax';

/** Resets module-level cross-parse state: TOC slugs, labels, theorem/list/footnote counters, MathJax numbering.
 *  Does NOT clear state.env.__mathpix (released with env) or tabular caches (cleanup_tabular_state hook handles those).
 *  Auto-invoked via reset_mmd_global_state hook; exported for one-shot converters. */
export const resetMmdGlobalState = (): void => {
  clearSlugsTocItems();
  ClearParseErrorList();
  resetTheoremEnvironments();
  clearLabelsList();
  rest_mmd_footnotes_list();
  clearItemizeLevelTokens();
  resetListState();
  resetListRenderDepth();   // also called from the plugin hook, which a partial render reaches
  resetEnvSnapshotPool();   // same: per-render, so the hook calls it too
  resetTextCounter();
  resetSizeCounter();
  MathJax.Reset();
};
