/**
 * Translate the integer indicating the charge to the appropriate text.
 * @param {Number} charge The integer indicating the charge.
 * @returns {String} A string representing a charge.
 */
export function getChargeText(charge) {
  // console.log('in the utility version of getChargeText');
  if (charge === 1) {
    return '+'
  } else if (charge === 2) {
    return '2+';
  } else if (charge === -1) {
    return '-';
  } else if (charge === -2) {
    return '2-';
  } else {
    return '';
  }
}
