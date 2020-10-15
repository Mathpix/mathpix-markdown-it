/**
 * A static class containing helper functions for math-related tasks.
 */
declare class MathHelper {
    /**
     * Rounds a value to a given number of decimals.
     *
     * @static
     * @param {Number} value A number.
     * @param {Number} decimals The number of decimals.
     * @returns {Number} A number rounded to a given number of decimals.
     */
    static round(value: any, decimals: any): number;
    /**
     * Returns the means of the angles contained in an array. In radians.
     *
     * @static
     * @param {Number[]} arr An array containing angles (in radians).
     * @returns {Number} The mean angle in radians.
     */
    static meanAngle(arr: any): number;
    /**
     * Returns the inner angle of a n-sided regular polygon.
     *
     * @static
     * @param {Number} n Number of sides of a regular polygon.
     * @returns {Number} The inner angle of a given regular polygon.
     */
    static innerAngle(n: any): number;
    /**
     * Returns the circumradius of a n-sided regular polygon with a given side-length.
     *
     * @static
     * @param {Number} s The side length of the regular polygon.
     * @param {Number} n The number of sides.
     * @returns {Number} The circumradius of the regular polygon.
     */
    static polyCircumradius(s: any, n: any): number;
    /**
     * Returns the apothem of a regular n-sided polygon based on its radius.
     *
     * @static
     * @param {Number} r The radius.
     * @param {Number} n The number of edges of the regular polygon.
     * @returns {Number} The apothem of a n-sided polygon based on its radius.
     */
    static apothem(r: any, n: any): number;
    static apothemFromSideLength(s: any, n: any): number;
    /**
     * The central angle of a n-sided regular polygon. In radians.
     *
     * @static
     * @param {Number} n The number of sides of the regular polygon.
     * @returns {Number} The central angle of the n-sided polygon in radians.
     */
    static centralAngle(n: any): number;
    /**
     * Convertes radians to degrees.
     *
     * @static
     * @param {Number} rad An angle in radians.
     * @returns {Number} The angle in degrees.
     */
    static toDeg(rad: any): number;
    /**
     * Converts degrees to radians.
     *
     * @static
     * @param {Number} deg An angle in degrees.
     * @returns {Number} The angle in radians.
     */
    static toRad(deg: any): number;
    /**
     * Returns the parity of the permutation (1 or -1)
     * @param {(Array|Uint8Array)} arr An array containing the permutation.
     * @returns {Number} The parity of the permutation (1 or -1), where 1 means even and -1 means odd.
     */
    static parityOfPermutation(arr: any): 1 | -1;
    /** The factor to convert degrees to radians. */
    static get radFactor(): number;
    /** The factor to convert radians to degrees. */
    static get degFactor(): number;
    /** Two times PI. */
    static get twoPI(): number;
}
export default MathHelper;
