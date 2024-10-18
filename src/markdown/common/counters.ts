export interface ISize {
  widthEx: number,
  heightEx: number
}

export let size: ISize = {
  heightEx: 0,
  widthEx: 0
}

export const resetSizeCounter = () => {
  size = {
    heightEx: 0,
    widthEx: 0
  }
}

export const setSizeCounter = (widthEx: number, heightEx: number) => {
  size.widthEx += widthEx;
  size.heightEx += heightEx;
}
