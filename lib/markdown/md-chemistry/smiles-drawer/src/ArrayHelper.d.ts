/**
 * A static class containing helper functions for array-related tasks.
 */
declare class ArrayHelper {
    /**
     * Clone an array or an object. If an object is passed, a shallow clone will be created.
     *
     * @static
     * @param {*} arr The array or object to be cloned.
     * @returns {*} A clone of the array or object.
     */
    static clone(arr: any): {};
    /**
     * Returns a boolean indicating whether or not the two arrays contain the same elements.
     * Only supports 1d, non-nested arrays.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Boolean} A boolean indicating whether or not the two arrays contain the same elements.
     */
    static equals(arrA: any, arrB: any): boolean;
    /**
     * Returns a string representation of an array. If the array contains objects with an id property, the id property is printed for each of the elements.
     *
     * @static
     * @param {Object[]} arr An array.
     * @param {*} arr[].id If the array contains an object with the property 'id', the properties value is printed. Else, the array elements value is printend.
     * @returns {String} A string representation of the array.
     */
    static print(arr: any): string;
    /**
     * Run a function for each element in the array. The element is supplied as an argument for the callback function
     *
     * @static
     * @param {Array} arr An array.
     * @param {Function} callback The callback function that is called for each element.
     */
    static each(arr: any, callback: any): void;
    /**
     * Return the array element from an array containing objects, where a property of the object is set to a given value.
     *
     * @static
     * @param {Array} arr An array.
     * @param {(String|Number)} property A property contained within an object in the array.
     * @param {(String|Number)} value The value of the property.
     * @returns {*} The array element matching the value.
     */
    static get(arr: any, property: any, value: any): any;
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
    static contains(arr: any, options: any): boolean;
    /**
     * Returns an array containing the intersection between two arrays. That is, values that are common to both arrays.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Array} The intersecting vlaues.
     */
    static intersection(arrA: any, arrB: any): any[];
    /**
     * Returns an array of unique elements contained in an array.
     *
     * @static
     * @param {Array} arr An array.
     * @returns {Array} An array of unique elements contained within the array supplied as an argument.
     */
    static unique(arr: any): any;
    /**
     * Count the number of occurences of a value in an array.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be counted.
     * @returns {Number} The number of occurences of a value in the array.
     */
    static count(arr: any, value: any): number;
    /**
     * Toggles the value of an array. If a value is not contained in an array, the array returned will contain all the values of the original array including the value. If a value is contained in an array, the array returned will contain all the values of the original array excluding the value.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be toggled.
     * @returns {Array} The toggled array.
     */
    static toggle(arr: any, value: any): any[];
    /**
     * Remove a value from an array.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be removed.
     * @returns {Array} A new array with the element with a given value removed.
     */
    static remove(arr: any, value: any): any[];
    /**
     * Remove a value from an array with unique values.
     *
     * @static
     * @param {Array} arr An array.
     * @param {*} value A value to be removed.
     * @returns {Array} An array with the element with a given value removed.
     */
    static removeUnique(arr: any, value: any): any;
    /**
     * Remove all elements contained in one array from another array.
     *
     * @static
     * @param {Array} arrA The array to be filtered.
     * @param {Array} arrB The array containing elements that will be removed from the other array.
     * @returns {Array} The filtered array.
     */
    static removeAll(arrA: any, arrB: any): any;
    /**
     * Merges two arrays and returns the result. The first array will be appended to the second array.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Array} The merged array.
     */
    static merge(arrA: any, arrB: any): any[];
    /**
     * Checks whether or not an array contains all the elements of another array, without regard to the order.
     *
     * @static
     * @param {Array} arrA An array.
     * @param {Array} arrB An array.
     * @returns {Boolean} A boolean indicating whether or not both array contain the same elements.
     */
    static containsAll(arrA: any, arrB: any): boolean;
    /**
     * Sort an array of atomic number information. Where the number is indicated as x, x.y, x.y.z, ...
     *
     * @param {Object[]} arr An array of vertex ids with their associated atomic numbers.
     * @param {Number} arr[].vertexId A vertex id.
     * @param {String} arr[].atomicNumber The atomic number associated with the vertex id.
     * @returns {Object[]} The array sorted by atomic number. Example of an array entry: { atomicNumber: 2, vertexId: 5 }.
     */
    static sortByAtomicNumberDesc(arr: any): any;
    /**
     * Copies a an n-dimensional array.
     *
     * @param {Array} arr The array to be copied.
     * @returns {Array} The copy.
     */
    static deepCopy(arr: any): any[];
}
export default ArrayHelper;
