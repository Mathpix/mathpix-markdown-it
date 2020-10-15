"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChargeText = void 0;
/**
 * Translate the integer indicating the charge to the appropriate text.
 * @param {Number} charge The integer indicating the charge.
 * @returns {String} A string representing a charge.
 */
function getChargeText(charge) {
    // console.log('in the utility version of getChargeText');
    if (charge === 1) {
        return '+';
    }
    else if (charge === 2) {
        return '2+';
    }
    else if (charge === -1) {
        return '-';
    }
    else if (charge === -2) {
        return '2-';
    }
    else {
        return '';
    }
}
exports.getChargeText = getChargeText;
//# sourceMappingURL=UtilityFunctions.js.map