class ThemeManager {
	public colors: any;
	public theme: any;

  constructor(colors, theme) {
    this.colors = colors;
    this.theme = this.colors[theme];
  }

  /**
   * Returns the hex code of a color associated with a key from the current theme.
   *
   * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
   * @returns {String} A color hex value.
   */
  getColor(key) {
    if (key) {
      key = key.toUpperCase();

      if (key in this.theme) {
        return this.theme[key];
      }
    }

    return this.theme['C'];
  }

  /**
   * Sets the theme to the specified string if it exists. If it does not, this
   * does nothing.
   *
   * @param {String} theme the name of the theme to switch to
   */
  setTheme(theme) {
    if (this.colors.hasOwnProperty(theme)) {
      this.theme = this.colors[theme];
    }

    // TODO: this probably should notify those who are watching this theme
    // manager that the theme has changed so that colors can be changed
    // on the fly
  }
}

export default ThemeManager;
