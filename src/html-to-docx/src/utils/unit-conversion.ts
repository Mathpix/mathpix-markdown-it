export const defaultHeadingSizesInPixel = {
  h1: 32,
  h2: 24,
  h3: 18.72,
  h4: 16,
  h5: 13.28,
  h6: 10.72,
};

export const pixelRegex = /([\d.]+)px/i;
export const percentageRegex = /([\d.]+)%/i;
export const pointRegex = /(\d+)pt/i;
export const cmRegex = /([\d.]+)cm/i;
export const inchRegex = /([\d.]+)in/i;

export const pixelToEMU = (pixelValue) => {
  return Math.round(pixelValue * 9525);
};

export const EMUToPixel = (EMUValue) => {
  return Math.round(EMUValue / 9525);
};

export const TWIPToEMU = (TWIPValue) => {
  return Math.round(TWIPValue * 635);
};

export const EMUToTWIP = (EMUValue) => {
  return Math.round(EMUValue / 635);
};

export const pointToTWIP = (pointValue) => {
  return Math.round(pointValue * 20);
};

export const TWIPToPoint = (TWIPValue) => {
  return Math.round(TWIPValue / 20);
};

export const pointToHIP = (pointValue) => {
  return Math.round(pointValue * 2);
};

export const HIPToPoint = (HIPValue) => {
  return Math.round(HIPValue / 2);
};

export const HIPToTWIP = (HIPValue) => {
  return Math.round(HIPValue * 10);
};

export const TWIPToHIP = (TWIPValue) => {
  return Math.round(TWIPValue / 10);
};

export const pixelToTWIP = (pixelValue) => {
  return EMUToTWIP(pixelToEMU(pixelValue));
};

export const TWIPToPixel = (TWIPValue) => {
  return EMUToPixel(TWIPToEMU(TWIPValue));
};

export const pixelToHIP = (pixelValue) => {
  return TWIPToHIP(EMUToTWIP(pixelToEMU(pixelValue)));
};

export const HIPToPixel = (HIPValue) => {
  return EMUToPixel(TWIPToEMU(HIPToTWIP(HIPValue)));
};

export const inchToPoint = (inchValue) => {
  return Math.round(inchValue * 72);
};

export const inchToTWIP = (inchValue) => {
  return pointToTWIP(inchToPoint(inchValue));
};

export const cmToInch = (cmValue) => {
  return cmValue * 0.3937008;
};

export const cmToTWIP = (cmValue) => {
  return inchToTWIP(cmToInch(cmValue));
};

export const pixelToPoint = (pixelValue) => {
  return HIPToPoint(pixelToHIP(pixelValue));
};

export const pointToPixel = (pointValue) => {
  return HIPToPixel(pointToHIP(pointValue));
};

export const EIPToPoint = (EIPValue) => {
  return Math.round(EIPValue / 8);
};

export const pointToEIP = (PointValue) => {
  return Math.round(PointValue * 8);
};

export const pixelToEIP = (pixelValue) => {
  return pointToEIP(pixelToPoint(pixelValue));
};

export const EIPToPixel = (EIPValue) => {
  return pointToPixel(EIPToPoint(EIPValue));
};
