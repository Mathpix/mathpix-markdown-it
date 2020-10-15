import Vector2 from './Vector2';
/**
 * A class representing a line.
 *
 * @property {Vector2} from The Vector2 defining the start of the line.
 * @property {Vector2} to The Vector2 defining the end of the line.
 * @property {String} elementFrom The element symbol associated with the start of the line.
 * @property {String} elementTo The element symbol associated with the end of the line.
 * @property {Boolean} chiralFrom A boolean indicating whether or not the source atom is a chiral center.
 * @property {Boolean} chiralTo A boolean indicating whether or tno the target atom is a chiral center.
 */
declare class Line {
    from: any;
    to: any;
    elementFrom: any;
    elementTo: any;
    chiralFrom: any;
    chiralTo: any;
    /**
     * The constructor for the class Line.
     *
     * @param {Vector2} [from=new Vector2(0, 0)] A vector marking the beginning of the line.
     * @param {Vector2} [to=new Vector2(0, 0)] A vector marking the end of the line.
     * @param {string} [elementFrom=null] A one-letter representation of the element associated with the vector marking the beginning of the line.
     * @param {string} [elementTo=null] A one-letter representation of the element associated with the vector marking the end of the line.
     * @param {Boolean} [chiralFrom=false] Whether or not the from atom is a chiral center.
     * @param {Boolean} [chiralTo=false] Whether or not the to atom is a chiral center.
     */
    constructor(from?: Vector2, to?: Vector2, elementFrom?: any, elementTo?: any, chiralFrom?: boolean, chiralTo?: boolean);
    /**
     * Clones this line and returns the clone.
     *
     * @returns {Line} A clone of this line.
     */
    clone(): Line;
    /**
     * Returns the length of this line.
     *
     * @returns {Number} The length of this line.
     */
    getLength(): number;
    /**
     * Returns the angle of the line in relation to the coordinate system (the x-axis).
     *
     * @returns {Number} The angle in radians.
     */
    getAngle(): number;
    /**
     * Returns the right vector (the vector with the larger x value).
     *
     * @returns {Vector2} The right vector.
     */
    getRightVector(): any;
    /**
     * Returns the left vector (the vector with the smaller x value).
     *
     * @returns {Vector2} The left vector.
     */
    getLeftVector(): any;
    /**
     * Returns the element associated with the right vector (the vector with the larger x value).
     *
     * @returns {String} The element associated with the right vector.
     */
    getRightElement(): any;
    /**
     * Returns the element associated with the left vector (the vector with the smaller x value).
     *
     * @returns {String} The element associated with the left vector.
     */
    getLeftElement(): any;
    /**
     * Returns whether or not the atom associated with the right vector (the vector with the larger x value) is a chiral center.
     *
     * @returns {Boolean} Whether or not the atom associated with the right vector is a chiral center.
     */
    getRightChiral(): any;
    /**
     * Returns whether or not the atom associated with the left vector (the vector with the smaller x value) is a chiral center.
     *
     * @returns {Boolean} Whether or not the atom  associated with the left vector is a chiral center.
     */
    getLeftChiral(): any;
    /**
     * Set the value of the right vector.
     *
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Line} This line.
     */
    setRightVector(x: any, y: any): this;
    /**
     * Set the value of the left vector.
     *
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Line} This line.
     */
    setLeftVector(x: any, y: any): this;
    /**
     * Rotates this line to be aligned with the x-axis. The center of rotation is the left vector.
     *
     * @returns {Line} This line.
     */
    rotateToXAxis(): this;
    /**
     * Rotate the line by a given value (in radians). The center of rotation is the left vector.
     *
     * @param {Number} theta The angle (in radians) to rotate the line.
     * @returns {Line} This line.
     */
    rotate(theta: any): this;
    /**
     * Shortens this line from the "from" direction by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shortenFrom(by: any): this;
    /**
     * Shortens this line from the "to" direction by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shortenTo(by: any): this;
    /**
     * Shorten the right side.
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} Returns itself.
     */
    shortenRight(by: any): this;
    /**
     * Shorten the left side.
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} Returns itself.
     */
    shortenLeft(by: any): this;
    /**
     * Shortens this line from both directions by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shorten(by: any): this;
}
export default Line;
