"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIPToPixel = exports.pixelToEIP = exports.pointToEIP = exports.EIPToPoint = exports.pointToPixel = exports.pixelToPoint = exports.cmToTWIP = exports.cmToInch = exports.inchToTWIP = exports.inchToPoint = exports.HIPToPixel = exports.pixelToHIP = exports.TWIPToPixel = exports.pixelToTWIP = exports.TWIPToHIP = exports.HIPToTWIP = exports.HIPToPoint = exports.pointToHIP = exports.TWIPToPoint = exports.pointToTWIP = exports.EMUToTWIP = exports.TWIPToEMU = exports.EMUToPixel = exports.pixelToEMU = exports.inchRegex = exports.cmRegex = exports.pointRegex = exports.percentageRegex = exports.pixelRegex = exports.defaultHeadingSizesInPixel = void 0;
exports.defaultHeadingSizesInPixel = {
    h1: 32,
    h2: 24,
    h3: 18.72,
    h4: 16,
    h5: 13.28,
    h6: 10.72,
};
exports.pixelRegex = /([\d.]+)px/i;
exports.percentageRegex = /([\d.]+)%/i;
exports.pointRegex = /(\d+)pt/i;
exports.cmRegex = /([\d.]+)cm/i;
exports.inchRegex = /([\d.]+)in/i;
exports.pixelToEMU = function (pixelValue) {
    return Math.round(pixelValue * 9525);
};
exports.EMUToPixel = function (EMUValue) {
    return Math.round(EMUValue / 9525);
};
exports.TWIPToEMU = function (TWIPValue) {
    return Math.round(TWIPValue * 635);
};
exports.EMUToTWIP = function (EMUValue) {
    return Math.round(EMUValue / 635);
};
exports.pointToTWIP = function (pointValue) {
    return Math.round(pointValue * 20);
};
exports.TWIPToPoint = function (TWIPValue) {
    return Math.round(TWIPValue / 20);
};
exports.pointToHIP = function (pointValue) {
    return Math.round(pointValue * 2);
};
exports.HIPToPoint = function (HIPValue) {
    return Math.round(HIPValue / 2);
};
exports.HIPToTWIP = function (HIPValue) {
    return Math.round(HIPValue * 10);
};
exports.TWIPToHIP = function (TWIPValue) {
    return Math.round(TWIPValue / 10);
};
exports.pixelToTWIP = function (pixelValue) {
    return exports.EMUToTWIP(exports.pixelToEMU(pixelValue));
};
exports.TWIPToPixel = function (TWIPValue) {
    return exports.EMUToPixel(exports.TWIPToEMU(TWIPValue));
};
exports.pixelToHIP = function (pixelValue) {
    return exports.TWIPToHIP(exports.EMUToTWIP(exports.pixelToEMU(pixelValue)));
};
exports.HIPToPixel = function (HIPValue) {
    return exports.EMUToPixel(exports.TWIPToEMU(exports.HIPToTWIP(HIPValue)));
};
exports.inchToPoint = function (inchValue) {
    return Math.round(inchValue * 72);
};
exports.inchToTWIP = function (inchValue) {
    return exports.pointToTWIP(exports.inchToPoint(inchValue));
};
exports.cmToInch = function (cmValue) {
    return cmValue * 0.3937008;
};
exports.cmToTWIP = function (cmValue) {
    return exports.inchToTWIP(exports.cmToInch(cmValue));
};
exports.pixelToPoint = function (pixelValue) {
    return exports.HIPToPoint(exports.pixelToHIP(pixelValue));
};
exports.pointToPixel = function (pointValue) {
    return exports.HIPToPixel(exports.pointToHIP(pointValue));
};
exports.EIPToPoint = function (EIPValue) {
    return Math.round(EIPValue / 8);
};
exports.pointToEIP = function (PointValue) {
    return Math.round(PointValue * 8);
};
exports.pixelToEIP = function (pixelValue) {
    return exports.pointToEIP(exports.pixelToPoint(pixelValue));
};
exports.EIPToPixel = function (EIPValue) {
    return exports.pointToPixel(exports.EIPToPoint(EIPValue));
};
//# sourceMappingURL=unit-conversion.js.map