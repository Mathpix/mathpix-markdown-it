import { Token, Renderer } from "markdown-it";
import { renderTableCellContent } from "../common/render-table-cell-content";

export const renderDiagBoxItem = (
  tokens: Token[],
  idx: number,
  options: Record<string, any> = {},
  env: Record<string, any> = {},
  slf: Renderer
): string => {
  const token: Token = tokens[idx];
  const attrs = slf.renderAttrs(token);
  const { content, tsv, csv, tableMd } = renderTableCellContent(token, true, options, env, slf);
  Object.assign(token, { tsv, csv, tableMd });
  return `<div ${attrs}>${content}</div>`;
};

export const renderDiagbox = (
  tokens: Token[],
  idx: number,
  options: unknown,
  env: Record<string, any> = {},
  slf: Renderer
): string => {
  const token: Token = tokens[idx];
  const styles: string[] = token.meta?.isBlock
    ? ['display: grid; height: 100%;']
    : ['display: inline-grid;',
      'background-size: 100% 100%;',
      `background-image: linear-gradient(to bottom ${token.type === 'backslashbox' ? 'left' : 'right'}, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));`
    ];

  token.attrJoin('style', styles.join(' '));
  const attrs = slf.renderAttrs(token);
  const res = slf.renderInline(token.children ?? [], options, env);
  const dataKeys = ["tsv", "csv", "tableMd"] as const;
  for (const key of dataKeys) {
    token[key] = token.children?.map(child => child[key]) ?? [];
  }
  return `<div ${attrs}>${res}</div>`;
};
