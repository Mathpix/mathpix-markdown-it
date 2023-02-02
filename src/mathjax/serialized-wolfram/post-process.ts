export const postProcessWolfram = (wolfram: string) => {
  /** add space after number and before later */
  wolfram = wolfram.replace(/([0-9])([a-zA-Z])/g, '$1 $2');
  return wolfram;
};
