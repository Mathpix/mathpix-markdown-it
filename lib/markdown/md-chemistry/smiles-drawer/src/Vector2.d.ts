/**
 * A class representing a 2D vector.
 *
 * @property {Number} x The x component of the vector.
 * @property {Number} y The y component of the vector.
 */
declare class Vector2 {
    x: any;
    y: any;
    /**
     * The constructor of the class Vector2.
     *
     * @param {(Number|Vector2)} x The initial x coordinate value or, if the single argument, a Vector2 object.
     * @param {Number} y The initial y coordinate value.
     */
    constructor(x: any, y: any);
    /**
     * Clones this vector and returns the clone.
     *
     * @returns {Vector2} The clone of this vector.
     */
    clone(): Vector2;
    /**
     * Returns a string representation of this vector.
     *
     * @returns {String} A string representation of this vector.
     */
    toString(): string;
    /**
     * Add the x and y coordinate values of a vector to the x and y coordinate values of this vector.
     *
     * @param {Vector2} vec Another vector.
     * @returns {Vector2} Returns itself.
     */
    add(vec: any): this;
    /**
     * Subtract the x and y coordinate values of a vector from the x and y coordinate values of this vector.
     *
     * @param {Vector2} vec Another vector.
     * @returns {Vector2} Returns itself.
     */
    subtract(vec: any): this;
    /**
     * Divide the x and y coordinate values of this vector by a scalar.
     *
     * @param {Number} scalar The scalar.
     * @returns {Vector2} Returns itself.
     */
    divide(scalar: any): this;
    /**
     * Multiply the x and y coordinate values of this vector by the values of another vector.
     *
     * @param {Vector2} v A vector.
     * @returns {Vector2} Returns itself.
     */
    multiply(v: any): this;
    /**
     * Multiply the x and y coordinate values of this vector by a scalar.
     *
     * @param {Number} scalar The scalar.
     * @returns {Vector2} Returns itself.
     */
    multiplyScalar(scalar: any): this;
    /**
     * Inverts this vector. Same as multiply(-1.0).
     *
     * @returns {Vector2} Returns itself.
     */
    invert(): this;
    /**
     * Returns the angle of this vector in relation to the coordinate system.
     *
     * @returns {Number} The angle in radians.
     */
    angle(): number;
    /**
     * Returns the euclidean distance between this vector and another vector.
     *
     * @param {Vector2} vec A vector.
     * @returns {Number} The euclidean distance between the two vectors.
     */
    distance(vec: any): number;
    /**
     * Returns the squared euclidean distance between this vector and another vector. When only the relative distances of a set of vectors are needed, this is is less expensive than using distance(vec).
     *
     * @param {Vector2} vec Another vector.
     * @returns {Number} The squared euclidean distance of the two vectors.
     */
    distanceSq(vec: any): number;
    /**
     * Checks whether or not this vector is in a clockwise or counter-clockwise rotational direction compared to another vector in relation to the coordinate system.
     *
     * @param {Vector2} vec Another vector.
     * @returns {Number} Returns -1, 0 or 1 if the vector supplied as an argument is clockwise, neutral or counter-clockwise respectively to this vector in relation to the coordinate system.
     */
    clockwise(vec: any): 0 | 1 | -1;
    /**
     * Checks whether or not this vector is in a clockwise or counter-clockwise rotational direction compared to another vector in relation to an arbitrary third vector.
     *
     * @param {Vector2} center The central vector.
     * @param {Vector2} vec Another vector.
     * @returns {Number} Returns -1, 0 or 1 if the vector supplied as an argument is clockwise, neutral or counter-clockwise respectively to this vector in relation to an arbitrary third vector.
     */
    relativeClockwise(center: any, vec: any): 0 | 1 | -1;
    /**
     * Rotates this vector by a given number of radians around the origin of the coordinate system.
     *
     * @param {Number} angle The angle in radians to rotate the vector.
     * @returns {Vector2} Returns itself.
     */
    rotate(angle: any): this;
    /**
     * Rotates this vector around another vector.
     *
     * @param {Number} angle The angle in radians to rotate the vector.
     * @param {Vector2} vec The vector which is used as the rotational center.
     * @returns {Vector2} Returns itself.
     */
    rotateAround(angle: any, vec: any): this;
    /**
     * Rotate a vector around a given center to the same angle as another vector (so that the two vectors and the center are in a line, with both vectors on one side of the center), keeps the distance from this vector to the center.
     *
     * @param {Vector2} vec The vector to rotate this vector to.
     * @param {Vector2} center The rotational center.
     * @param {Number} [offsetAngle=0.0] An additional amount of radians to rotate the vector.
     * @returns {Vector2} Returns itself.
     */
    rotateTo(vec: any, center: any, offsetAngle?: number): this;
    /**
     * Rotates the vector away from a specified vector around a center.
     *
     * @param {Vector2} vec The vector this one is rotated away from.
     * @param {Vector2} center The rotational center.
     * @param {Number} angle The angle by which to rotate.
     */
    rotateAwayFrom(vec: any, center: any, angle: any): void;
    /**
     * Returns the angle in radians used to rotate this vector away from a given vector.
     *
     * @param {Vector2} vec The vector this one is rotated away from.
     * @param {Vector2} center The rotational center.
     * @param {Number} angle The angle by which to rotate.
     * @returns {Number} The angle in radians.
     */
    getRotateAwayFromAngle(vec: any, center: any, angle: any): any;
    /**
     * Returns the angle in radians used to rotate this vector towards a given vector.
     *
     * @param {Vector2} vec The vector this one is rotated towards to.
     * @param {Vector2} center The rotational center.
     * @param {Number} angle The angle by which to rotate.
     * @returns {Number} The angle in radians.
     */
    getRotateTowardsAngle(vec: any, center: any, angle: any): any;
    /**
     * Gets the angles between this vector and another vector around a common center of rotation.
     *
     * @param {Vector2} vec Another vector.
     * @param {Vector2} center The center of rotation.
     * @returns {Number} The angle between this vector and another vector around a center of rotation in radians.
     */
    getRotateToAngle(vec: any, center: any): number;
    /**
     * Checks whether a vector lies within a polygon spanned by a set of vectors.
     *
     * @param {Vector2[]} polygon An array of vectors spanning the polygon.
     * @returns {Boolean} A boolean indicating whether or not this vector is within a polygon.
     */
    isInPolygon(polygon: any): boolean;
    /**
     * Returns the length of this vector.
     *
     * @returns {Number} The length of this vector.
     */
    length(): number;
    /**
     * Returns the square of the length of this vector.
     *
     * @returns {Number} The square of the length of this vector.
     */
    lengthSq(): number;
    /**
     * Normalizes this vector.
     *
     * @returns {Vector2} Returns itself.
     */
    normalize(): this;
    /**
     * Returns a normalized copy of this vector.
     *
     * @returns {Vector2} A normalized copy of this vector.
     */
    normalized(): Vector2;
    /**
     * Calculates which side of a line spanned by two vectors this vector is.
     *
     * @param {Vector2} vecA A vector.
     * @param {Vector2} vecB A vector.
     * @returns {Number} A number indicating the side of this vector, given a line spanned by two other vectors.
     */
    whichSide(vecA: any, vecB: any): number;
    /**
     * Checks whether or not this vector is on the same side of a line spanned by two vectors as another vector.
     *
     * @param {Vector2} vecA A vector spanning the line.
     * @param {Vector2} vecB A vector spanning the line.
     * @param {Vector2} vecC A vector to check whether or not it is on the same side as this vector.
     * @returns {Boolean} Returns a boolean indicating whether or not this vector is on the same side as another vector.
     */
    sameSideAs(vecA: any, vecB: any, vecC: any): boolean;
    /**
     * Adds two vectors and returns the result as a new vector.
     *
     * @static
     * @param {Vector2} vecA A summand.
     * @param {Vector2} vecB A summand.
     * @returns {Vector2} Returns the sum of two vectors.
     */
    static add(vecA: any, vecB: any): Vector2;
    /**
     * Subtracts one vector from another and returns the result as a new vector.
     *
     * @static
     * @param {Vector2} vecA The minuend.
     * @param {Vector2} vecB The subtrahend.
     * @returns {Vector2} Returns the difference of two vectors.
     */
    static subtract(vecA: any, vecB: any): Vector2;
    /**
     * Multiplies two vectors (value by value) and returns the result.
     *
     * @static
     * @param {Vector2} vecA A vector.
     * @param {Vector2} vecB A vector.
     * @returns {Vector2} Returns the product of two vectors.
     */
    static multiply(vecA: any, vecB: any): Vector2;
    /**
     * Multiplies two vectors (value by value) and returns the result.
     *
     * @static
     * @param {Vector2} vec A vector.
     * @param {Number} scalar A scalar.
     * @returns {Vector2} Returns the product of two vectors.
     */
    static multiplyScalar(vec: any, scalar: any): Vector2;
    /**
     * Returns the midpoint of a line spanned by two vectors.
     *
     * @static
     * @param {Vector2} vecA A vector spanning the line.
     * @param {Vector2} vecB A vector spanning the line.
     * @returns {Vector2} The midpoint of the line spanned by two vectors.
     */
    static midpoint(vecA: any, vecB: any): Vector2;
    /**
     * Returns the normals of a line spanned by two vectors.
     *
     * @static
     * @param {Vector2} vecA A vector spanning the line.
     * @param {Vector2} vecB A vector spanning the line.
     * @returns {Vector2[]} An array containing the two normals, each represented by a vector.
     */
    static normals(vecA: any, vecB: any): Vector2[];
    /**
     * Returns the unit (normalized normal) vectors of a line spanned by two vectors.
     *
     * @static
     * @param {Vector2} vecA A vector spanning the line.
     * @param {Vector2} vecB A vector spanning the line.
     * @returns {Vector2[]} An array containing the two unit vectors.
     */
    static units(vecA: any, vecB: any): Vector2[];
    /**
     * Divides a vector by another vector and returns the result as new vector.
     *
     * @static
     * @param {Vector2} vecA The dividend.
     * @param {Vector2} vecB The divisor.
     * @returns {Vector2} The fraction of the two vectors.
     */
    static divide(vecA: any, vecB: any): Vector2;
    /**
     * Divides a vector by a scalar and returns the result as new vector.
     *
     * @static
     * @param {Vector2} vecA The dividend.
     * @param {Number} s The scalar.
     * @returns {Vector2} The fraction of the two vectors.
     */
    static divideScalar(vecA: any, s: any): Vector2;
    /**
     * Returns the dot product of two vectors.
     *
     * @static
     * @param {Vector2} vecA A vector.
     * @param {Vector2} vecB A vector.
     * @returns {Number} The dot product of two vectors.
     */
    static dot(vecA: any, vecB: any): number;
    /**
     * Returns the angle between two vectors.
     *
     * @static
     * @param {Vector2} vecA A vector.
     * @param {Vector2} vecB A vector.
     * @returns {Number} The angle between two vectors in radians.
     */
    static angle(vecA: any, vecB: any): number;
    /**
     * Returns the angle between two vectors based on a third vector in between.
     *
     * @static
     * @param {Vector2} vecA A vector.
     * @param {Vector2} vecB A (central) vector.
     * @param {Vector2} vecC A vector.
     * @returns {Number} The angle in radians.
     */
    static threePointangle(vecA: any, vecB: any, vecC: any): number;
    /**
     * Returns the scalar projection of a vector on another vector.
     *
     * @static
     * @param {Vector2} vecA The vector to be projected.
     * @param {Vector2} vecB The vector to be projection upon.
     * @returns {Number} The scalar component.
     */
    static scalarProjection(vecA: any, vecB: any): number;
    /**
    * Returns the average vector (normalized) of the input vectors.
    *
    * @static
    * @param {Array} vecs An array containing vectors.
    * @returns {Vector2} The resulting vector (normalized).
    */
    static averageDirection(vecs: any): Vector2;
}
export default Vector2;
