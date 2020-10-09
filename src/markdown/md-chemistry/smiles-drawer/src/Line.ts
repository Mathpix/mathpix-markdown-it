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
class Line {
	public from: any;
	public to: any;
	public elementFrom: any;
	public elementTo: any;
	public chiralFrom: any;
	public chiralTo: any;

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
    constructor(from = new Vector2(0,0), to = new Vector2(0, 0), elementFrom = null, elementTo = null, chiralFrom = false, chiralTo = false) {
        this.from = from;
        this.to = to;
        this.elementFrom = elementFrom;
        this.elementTo = elementTo;
        this.chiralFrom = chiralFrom;
        this.chiralTo = chiralTo;
    }

    /**
     * Clones this line and returns the clone.
     *
     * @returns {Line} A clone of this line.
     */
    clone() {
        return new Line(this.from.clone(), this.to.clone(), this.elementFrom, this.elementTo);
    }

    /**
     * Returns the length of this line.
     *
     * @returns {Number} The length of this line.
     */
    getLength() {
        return Math.sqrt(Math.pow(this.to.x - this.from.x, 2) +
                         Math.pow(this.to.y - this.from.y, 2));
    }


    /**
     * Returns the angle of the line in relation to the coordinate system (the x-axis).
     *
     * @returns {Number} The angle in radians.
     */
    getAngle() {
        // Get the angle between the line and the x-axis
        let diff = Vector2.subtract(this.getRightVector(), this.getLeftVector());
        return diff.angle();
    }

    /**
     * Returns the right vector (the vector with the larger x value).
     *
     * @returns {Vector2} The right vector.
     */
    getRightVector() {
        // Return the vector with the larger x value (the right one)
        if (this.from.x < this.to.x) {
            return this.to;
        } else {
            return this.from;
        }
    }

    /**
     * Returns the left vector (the vector with the smaller x value).
     *
     * @returns {Vector2} The left vector.
     */
    getLeftVector() {
        // Return the vector with the smaller x value (the left one)
        if (this.from.x < this.to.x) {
            return this.from;
        } else {
            return this.to;
        }
    }

    /**
     * Returns the element associated with the right vector (the vector with the larger x value).
     *
     * @returns {String} The element associated with the right vector.
     */
    getRightElement() {
        if (this.from.x < this.to.x) {
            return this.elementTo;
        } else {
            return this.elementFrom;
        }
    }

    /**
     * Returns the element associated with the left vector (the vector with the smaller x value).
     *
     * @returns {String} The element associated with the left vector.
     */
    getLeftElement() {
        if (this.from.x < this.to.x) {
            return this.elementFrom;
        } else {
            return this.elementTo;
        }
    }

    /**
     * Returns whether or not the atom associated with the right vector (the vector with the larger x value) is a chiral center.
     *
     * @returns {Boolean} Whether or not the atom associated with the right vector is a chiral center.
     */
    getRightChiral() {
        if (this.from.x < this.to.x) {
            return this.chiralTo;
        } else {
            return this.chiralFrom;
        }
    }

    /**
     * Returns whether or not the atom associated with the left vector (the vector with the smaller x value) is a chiral center.
     *
     * @returns {Boolean} Whether or not the atom  associated with the left vector is a chiral center.
     */
    getLeftChiral() {
        if (this.from.x < this.to.x) {
            return this.chiralFrom;
        } else {
            return this.chiralTo;
        }
    }

    /**
     * Set the value of the right vector.
     *
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Line} This line.
     */
    setRightVector(x, y) {
        if (this.from.x < this.to.x) {
            this.to.x = x;
            this.to.y = y;
        } else {
            this.from.x = x;
            this.from.y = y;
        }

        return this;
    }

    /**
     * Set the value of the left vector.
     *
     * @param {Number} x The x value.
     * @param {Number} y The y value.
     * @returns {Line} This line.
     */
    setLeftVector(x, y) {
        if (this.from.x < this.to.x) {
            this.from.x = x;
            this.from.y = y;
        } else {
            this.to.x = x;
            this.to.y = y;
        }

        return this;
    }

    /**
     * Rotates this line to be aligned with the x-axis. The center of rotation is the left vector.
     *
     * @returns {Line} This line.
     */
    rotateToXAxis() {
        let left = this.getLeftVector();

        this.setRightVector(left.x + this.getLength(), left.y);

        return this;
    }

    /**
     * Rotate the line by a given value (in radians). The center of rotation is the left vector.
     *
     * @param {Number} theta The angle (in radians) to rotate the line.
     * @returns {Line} This line.
     */
    rotate(theta) {
        let l = this.getLeftVector();
        let r = this.getRightVector();
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        let x = cosTheta * (r.x - l.x) - sinTheta * (r.y - l.y) + l.x;
        let y = sinTheta * (r.x - l.x) - cosTheta * (r.y - l.y) + l.y;

        this.setRightVector(x, y);

        return this;
    }

    /**
     * Shortens this line from the "from" direction by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shortenFrom(by) {
        let f = Vector2.subtract(this.to, this.from);

        f.normalize();
        f.multiplyScalar(by);

        this.from.add(f);

        return this;
    }

    /**
     * Shortens this line from the "to" direction by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shortenTo(by) {
        let f = Vector2.subtract(this.from, this.to);

        f.normalize();
        f.multiplyScalar(by);

        this.to.add(f);

        return this;
    }

    /**
     * Shorten the right side.
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} Returns itself.
     */
    shortenRight(by) {
        if (this.from.x < this.to.x) {
            this.shortenTo(by);
        } else {
            this.shortenFrom(by);
        }

        return this;
    }

    /**
     * Shorten the left side.
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} Returns itself.
     */
    shortenLeft(by) {
        if (this.from.x < this.to.x) {
            this.shortenFrom(by);
        } else {
            this.shortenTo(by);
        }

        return this;
    }

    /**
     * Shortens this line from both directions by a given value (in pixels).
     *
     * @param {Number} by The length in pixels to shorten the vector by.
     * @returns {Line} This line.
     */
    shorten(by) {
        let f = Vector2.subtract(this.from, this.to);

        f.normalize();
        f.multiplyScalar(by / 2.0);

        this.to.add(f);
        this.from.subtract(f);

        return this;
    }
}

export default Line;
