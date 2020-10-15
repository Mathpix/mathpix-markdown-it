"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A static class containing helper functions for array-related tasks.
 */
var ArrayHelper = /** @class */ (function () {
    function ArrayHelper() {
    }
    /**
     * Clone an array or an object. If an object is passed, a shallow clone will be created.
     *
     * @static
     * @param {*} arr The array or object to be cloned.
     * @returns {*} A clone of the array or object.
     */
    ArrayHelper.clone = function (arr) {
        var out = Array.isArray(arr) ? Array() : {};
        for (var key in arr) {
            var value = arr[key];
            if (typeof value.clone === 'function') {
                out[key] = value.clone();
            }
            else {
                out[key] = (typeof value === 'object') ? ArrayHelper.clone(value) : value;
            }
        }
        return out;
    };
    /**
     * Returns a boolean indicating whether or not the two arrays contain the same elements.
     * Only supports 1d, non-nested arrays.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Boolean} A boolean indicating whether or not the two arrays contain the same elements.
     */
    ArrayHelper.equals = function (arrA, arrB) {
        if (arrA.length !== arrB.length) {
            return false;
        }
        var tmpA = arrA.slice().sort();
        var tmpB = arrB.slice().sort();
        for (var i = 0; i < tmpA.length; i++) {
            if (tmpA[i] !== tmpB[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Returns a string representation of an array. If the array contains objects with an id property, the id property is printed for each of the elements.
     *
     * @static
     * @param {Object[]} arr An array.
     * @param {*} arr[].id If the array contains an object with the property 'id', the properties value is printed. Else, the array elements value is printend.
     * @returns {String} A string representation of the array.
     */
    ArrayHelper.print = function (arr) {
        if (arr.length == 0) {
            return '';
        }
        var s = '(';
        for (var i = 0; i < arr.length; i++) {
            s += arr[i].id ? arr[i].id + ', ' : arr[i] + ', ';
        }
        s = s.substring(0, s.length - 2);
        return s + ')';
    };
    /**
     * Run a function for each element in the array. The element is supplied as an argument for the callback function
     *
     * @static
     * @param {Array} arr An array.
     * @param {Function} callback The callback function that is called for each element.
     */
    ArrayHelper.each = function (arr, callback) {
        for (var i = 0; i < arr.length; i++) {
            callback(arr[i]);
        }
    };
    /**
     * Return the array element from an array containing objects, where a property of the object is set to a given value.
     *
     * @static
     * @param {Array} arr An array.
     * @param {(String|Number)} property A property contained within an object in the array.
     * @param {(String|Number)} value The value of the property.
     * @returns {*} The array element matching the value.
     */
    ArrayHelper.get = function (arr, property, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][property] == value) {
                return arr[i];
            }
        }
    };
    /**
     * Checks whether or not an array contains a given value. the options object passed as a second argument can contain three properties. value: The value to be searched for. property: The property that is to be searched for a given value. func: A function that is used as a callback to return either true or false in order to do a custom comparison.
     *
     * @static
     * @param {Array} arr An array.
     * @param {Object} options See method description.
     * @param {*} options.value The value for which to check.
     * @param {String} [options.property=undefined] The property on which to check.
     * @param {Function} [options.func=undefined] A custom property function.
     * @returns {Boolean} A boolean whether or not the array contains a value.
     */
    ArrayHelper.contains = function (arr, options) {
        if (!options.property && !options.func) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == options.value) {
                    return true;
                }
            }
        }
        else if (options.func) {
            for (var i = 0; i < arr.length; i++) {
                if (options.func(arr[i])) {
                    return true;
                }
            }
        }
        else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][options.property] == options.value) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Returns an array containing the intersection between two arrays. That is, values that are common to both arrays.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Array} The intersecting vlaues.
     */
    ArrayHelper.intersection = function (arrA, arrB) {
        var intersection = new Array();
        for (var i = 0; i < arrA.length; i++) {
            for (var j = 0; j < arrB.length; j++) {
                if (arrA[i] === arrB[j]) {
                    intersection.push(arrA[i]);
                }
            }
        }
        return intersection;
    };
    /**
     * Returns an array of unique elements contained in an array.
     *
     * @static
     * @param {Array} arr An array.
     * @returns {Array} An array of unique elements contained within the array supplied as an argument.
     */
    ArrayHelper.unique = function (arr) {
        var contains = {};
        return arr.filter(function (i) {
            // using !== instead of hasOwnProperty (http://andrew.hedges.name/experiments/in/)
            return contains[i] !== undefined ? false : (contains[i] = true);
        });
    };
    /**
     * Count the number of occurences of a value in an array.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be counted.
     * @returns {Number} The number of occurences of a value in the array.
     */
    ArrayHelper.count = function (arr, value) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                count++;
            }
        }
        return count;
    };
    /**
     * Toggles the value of an array. If a value is not contained in an array, the array returned will contain all the values of the original array including the value. If a value is contained in an array, the array returned will contain all the values of the original array excluding the value.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be toggled.
     * @returns {Array} The toggled array.
     */
    ArrayHelper.toggle = function (arr, value) {
        var newArr = Array();
        var removed = false;
        for (var i = 0; i < arr.length; i++) {
            // Do not copy value if it exists
            if (arr[i] !== value) {
                newArr.push(arr[i]);
            }
            else {
                // The element was not copied to the new array, which
                // means it was removed
                removed = true;
            }
        }
        // If the element was not removed, then it was not in the array
        // so add it
        if (!removed) {
            newArr.push(value);
        }
        return newArr;
    };
    /**
     * Remove a value from an array.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be removed.
     * @returns {Array} A new array with the element with a given value removed.
     */
    ArrayHelper.remove = function (arr, value) {
        var tmp = Array();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== value) {
                tmp.push(arr[i]);
            }
        }
        return tmp;
    };
    /**
     * Remove a value from an array with unique values.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be removed.
     * @returns {Array} An array with the element with a given value removed.
     */
    ArrayHelper.removeUnique = function (arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    };
    /**
     * Remove all elements contained in one array from another array.
     *
     * @static
     * @param {Array} arrA The array to be filtered.
     * @param {Array} arrB The array containing elements that will be removed from the other array.
     * @returns {Array} The filtered array.
     */
    ArrayHelper.removeAll = function (arrA, arrB) {
        return arrA.filter(function (item) {
            return arrB.indexOf(item) === -1;
        });
    };
    /**
     * Merges two arrays and returns the result. The first array will be appended to the second array.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Array} The merged array.
     */
    ArrayHelper.merge = function (arrA, arrB) {
        var arr = new Array(arrA.length + arrB.length);
        for (var i = 0; i < arrA.length; i++) {
            arr[i] = arrA[i];
        }
        for (var i = 0; i < arrB.length; i++) {
            arr[arrA.length + i] = arrB[i];
        }
        return arr;
    };
    /**
     * Checks whether or not an array contains all the elements of another array, without regard to the order.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Boolean} A boolean indicating whether or not both array contain the same elements.
     */
    ArrayHelper.containsAll = function (arrA, arrB) {
        var containing = 0;
        for (var i = 0; i < arrA.length; i++) {
            for (var j = 0; j < arrB.length; j++) {
                if (arrA[i] === arrB[j]) {
                    containing++;
                }
            }
        }
        return containing === arrB.length;
    };
    /**
     * Sort an array of atomic number information. Where the number is indicated as x, x.y, x.y.z, ...
     *
     * @param {Object[]} arr An array of vertex ids with their associated atomic numbers.
     * @param {Number} arr[].vertexId A vertex id.
     * @param {String} arr[].atomicNumber The atomic number associated with the vertex id.
     * @returns {Object[]} The array sorted by atomic number. Example of an array entry: { atomicNumber: 2, vertexId: 5 }.
     */
    ArrayHelper.sortByAtomicNumberDesc = function (arr) {
        var map = arr.map(function (e, i) {
            return { index: i, value: e.atomicNumber.split('.').map(Number) };
        });
        map.sort(function (a, b) {
            var min = Math.min(b.value.length, a.value.length);
            var i = 0;
            while (i < min && b.value[i] === a.value[i]) {
                i++;
            }
            return i === min ? b.value.length - a.value.length : b.value[i] - a.value[i];
        });
        return map.map(function (e) {
            return arr[e.index];
        });
    };
    /**
     * Copies a an n-dimensional array.
     *
     * @param {Array} arr The array to be copied.
     * @returns {Array} The copy.
     */
    ArrayHelper.deepCopy = function (arr) {
        var newArr = Array();
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item instanceof Array) {
                newArr[i] = ArrayHelper.deepCopy(item);
            }
            else {
                newArr[i] = item;
            }
        }
        return newArr;
    };
    return ArrayHelper;
}());
exports.default = ArrayHelper;
//# sourceMappingURL=ArrayHelper.js.map