/**
 * A static class containing helper functions for math-related tasks.
 */
class MathHelper {
    /**
     * Rounds a value to a given number of decimals.
     *
     * @static
     * @param {Number} value A number.
     * @param {Number} decimals The number of decimals.
     * @returns {Number} A number rounded to a given number of decimals.
     */
    static round(value, decimals) {
        decimals = decimals ? decimals : 1;
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }

    /**
     * Returns the means of the angles contained in an array. In radians.
     *
     * @static
     * @param {Number[]} arr An array containing angles (in radians).
     * @returns {Number} The mean angle in radians.
     */
    static meanAngle(arr) {
        let sin = 0.0;
        let cos = 0.0;

        for (var i = 0; i < arr.length; i++) {
            sin += Math.sin(arr[i]);
            cos += Math.cos(arr[i]);
        }

        return Math.atan2(sin / arr.length, cos / arr.length);
    }

    /**
     * Returns the inner angle of a n-sided regular polygon.
     *
     * @static
     * @param {Number} n Number of sides of a regular polygon.
     * @returns {Number} The inner angle of a given regular polygon.
     */
    static innerAngle(n) {
        return MathHelper.toRad((n - 2) * 180 / n);
    }

    /**
     * Returns the circumradius of a n-sided regular polygon with a given side-length.
     *
     * @static
     * @param {Number} s The side length of the regular polygon.
     * @param {Number} n The number of sides.
     * @returns {Number} The circumradius of the regular polygon.
     */
    static polyCircumradius(s, n) {
        return s / (2 * Math.sin(Math.PI / n));
    }

    /**
     * Returns the apothem of a regular n-sided polygon based on its radius.
     *
     * @static
     * @param {Number} r The radius.
     * @param {Number} n The number of edges of the regular polygon.
     * @returns {Number} The apothem of a n-sided polygon based on its radius.
     */
    static apothem(r, n) {
        return r * Math.cos(Math.PI / n);
    }

    static apothemFromSideLength(s, n) {
        let r = MathHelper.polyCircumradius(s, n);

        return MathHelper.apothem(r, n);
    }

    /**
     * The central angle of a n-sided regular polygon. In radians.
     *
     * @static
     * @param {Number} n The number of sides of the regular polygon.
     * @returns {Number} The central angle of the n-sided polygon in radians.
     */
    static centralAngle(n) {
        return MathHelper.toRad(360 / n);
    }

    /**
     * Convertes radians to degrees.
     *
     * @static
     * @param {Number} rad An angle in radians.
     * @returns {Number} The angle in degrees.
     */
    static toDeg(rad) {
        return rad * MathHelper.degFactor;
    }

    /**
     * Converts degrees to radians.
     *
     * @static
     * @param {Number} deg An angle in degrees.
     * @returns {Number} The angle in radians.
     */
    static toRad(deg) {
        return deg * MathHelper.radFactor;
    }

    /**
     * Returns the parity of the permutation (1 or -1)
     * @param {(Array|Uint8Array)} arr An array containing the permutation.
     * @returns {Number} The parity of the permutation (1 or -1), where 1 means even and -1 means odd.
     */
    static parityOfPermutation(arr) {
        let visited = new Uint8Array(arr.length);
        let evenLengthCycleCount = 0;

        let traverseCycle = function(i, cycleLength = 0) {
            if (visited[i] === 1) {
                return cycleLength;
            }

            cycleLength++;

            visited[i] = 1;
            return traverseCycle(arr[i], cycleLength);
        }

        for (var i = 0; i < arr.length; i++) {
            if (visited[i] === 1) {
                continue;
            }

            let cycleLength = traverseCycle(i);
            evenLengthCycleCount += (1 - cycleLength % 2);
        }

        return evenLengthCycleCount % 2 ? -1 : 1;
    }

    /** The factor to convert degrees to radians. */
    static get radFactor() {
      return Math.PI / 180.0;
    }

    /** The factor to convert radians to degrees. */
    static get degFactor() {
      return 180.0 / Math.PI;
    }

    /** Two times PI. */
    static get twoPI() {
      return 2.0 * Math.PI;
    }
}

export default MathHelper;
