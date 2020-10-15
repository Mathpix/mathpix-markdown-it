"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A static class containing helper functions for math-related tasks.
 */
var MathHelper = /** @class */ (function () {
    function MathHelper() {
    }
    /**
     * Rounds a value to a given number of decimals.
     *
     * @static
     * @param {Number} value A number.
     * @param {Number} decimals The number of decimals.
     * @returns {Number} A number rounded to a given number of decimals.
     */
    MathHelper.round = function (value, decimals) {
        decimals = decimals ? decimals : 1;
        return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    };
    /**
     * Returns the means of the angles contained in an array. In radians.
     *
     * @static
     * @param {Number[]} arr An array containing angles (in radians).
     * @returns {Number} The mean angle in radians.
     */
    MathHelper.meanAngle = function (arr) {
        var sin = 0.0;
        var cos = 0.0;
        for (var i = 0; i < arr.length; i++) {
            sin += Math.sin(arr[i]);
            cos += Math.cos(arr[i]);
        }
        return Math.atan2(sin / arr.length, cos / arr.length);
    };
    /**
     * Returns the inner angle of a n-sided regular polygon.
     *
     * @static
     * @param {Number} n Number of sides of a regular polygon.
     * @returns {Number} The inner angle of a given regular polygon.
     */
    MathHelper.innerAngle = function (n) {
        return MathHelper.toRad((n - 2) * 180 / n);
    };
    /**
     * Returns the circumradius of a n-sided regular polygon with a given side-length.
     *
     * @static
     * @param {Number} s The side length of the regular polygon.
     * @param {Number} n The number of sides.
     * @returns {Number} The circumradius of the regular polygon.
     */
    MathHelper.polyCircumradius = function (s, n) {
        return s / (2 * Math.sin(Math.PI / n));
    };
    /**
     * Returns the apothem of a regular n-sided polygon based on its radius.
     *
     * @static
     * @param {Number} r The radius.
     * @param {Number} n The number of edges of the regular polygon.
     * @returns {Number} The apothem of a n-sided polygon based on its radius.
     */
    MathHelper.apothem = function (r, n) {
        return r * Math.cos(Math.PI / n);
    };
    MathHelper.apothemFromSideLength = function (s, n) {
        var r = MathHelper.polyCircumradius(s, n);
        return MathHelper.apothem(r, n);
    };
    /**
     * The central angle of a n-sided regular polygon. In radians.
     *
     * @static
     * @param {Number} n The number of sides of the regular polygon.
     * @returns {Number} The central angle of the n-sided polygon in radians.
     */
    MathHelper.centralAngle = function (n) {
        return MathHelper.toRad(360 / n);
    };
    /**
     * Convertes radians to degrees.
     *
     * @static
     * @param {Number} rad An angle in radians.
     * @returns {Number} The angle in degrees.
     */
    MathHelper.toDeg = function (rad) {
        return rad * MathHelper.degFactor;
    };
    /**
     * Converts degrees to radians.
     *
     * @static
     * @param {Number} deg An angle in degrees.
     * @returns {Number} The angle in radians.
     */
    MathHelper.toRad = function (deg) {
        return deg * MathHelper.radFactor;
    };
    /**
     * Returns the parity of the permutation (1 or -1)
     * @param {(Array|Uint8Array)} arr An array containing the permutation.
     * @returns {Number} The parity of the permutation (1 or -1), where 1 means even and -1 means odd.
     */
    MathHelper.parityOfPermutation = function (arr) {
        var visited = new Uint8Array(arr.length);
        var evenLengthCycleCount = 0;
        var traverseCycle = function (i, cycleLength) {
            if (cycleLength === void 0) { cycleLength = 0; }
            if (visited[i] === 1) {
                return cycleLength;
            }
            cycleLength++;
            visited[i] = 1;
            return traverseCycle(arr[i], cycleLength);
        };
        for (var i = 0; i < arr.length; i++) {
            if (visited[i] === 1) {
                continue;
            }
            var cycleLength = traverseCycle(i);
            evenLengthCycleCount += (1 - cycleLength % 2);
        }
        return evenLengthCycleCount % 2 ? -1 : 1;
    };
    Object.defineProperty(MathHelper, "radFactor", {
        /** The factor to convert degrees to radians. */
        get: function () {
            return Math.PI / 180.0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MathHelper, "degFactor", {
        /** The factor to convert radians to degrees. */
        get: function () {
            return 180.0 / Math.PI;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MathHelper, "twoPI", {
        /** Two times PI. */
        get: function () {
            return 2.0 * Math.PI;
        },
        enumerable: false,
        configurable: true
    });
    return MathHelper;
}());
exports.default = MathHelper;
//# sourceMappingURL=MathHelper.js.map