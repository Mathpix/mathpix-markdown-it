declare class ThemeManager {
    colors: any;
    theme: any;
    constructor(colors: any, theme: any);
    /**
     * Returns the hex code of a color associated with a key from the current theme.
     *
     * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
     * @returns {String} A color hex value.
     */
    getColor(key: any): any;
    /**
     * Sets the theme to the specified string if it exists. If it does not, this
     * does nothing.
     *
     * @param {String} theme the name of the theme to switch to
     */
    setTheme(theme: any): void;
}
export default ThemeManager;
