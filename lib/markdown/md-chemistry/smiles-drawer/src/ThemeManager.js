"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ThemeManager = /** @class */ (function () {
    function ThemeManager(colors, theme) {
        this.colors = colors;
        this.theme = this.colors[theme];
    }
    /**
     * Returns the hex code of a color associated with a key from the current theme.
     *
     * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
     * @returns {String} A color hex value.
     */
    ThemeManager.prototype.getColor = function (key) {
        if (key) {
            key = key.toUpperCase();
            if (key in this.theme) {
                return this.theme[key];
            }
        }
        return this.theme['C'];
    };
    /**
     * Sets the theme to the specified string if it exists. If it does not, this
     * does nothing.
     *
     * @param {String} theme the name of the theme to switch to
     */
    ThemeManager.prototype.setTheme = function (theme) {
        if (this.colors.hasOwnProperty(theme)) {
            this.theme = this.colors[theme];
        }
        // TODO: this probably should notify those who are watching this theme
        // manager that the theme has changed so that colors can be changed
        // on the fly
    };
    return ThemeManager;
}());
exports.default = ThemeManager;
//# sourceMappingURL=ThemeManager.js.map