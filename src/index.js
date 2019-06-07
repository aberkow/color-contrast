const { Command, flags } = require('@oclif/command')

class ContrastCommand extends Command {
  async run() {
    
    const { flags } = this.parse(ContrastCommand)
    
    const bg = flags.background || 'ffffff'
    const fg = flags.foreground || '000000'
    let evaluatedBg
    let evaluatedFg

    if (flags.rgb) {
      this.log('rgb set')
      evaluatedBg = this.cleanRGB(bg)
      evaluatedFg = this.cleanRGB(fg)
    } else if (flags.hsl) {
      this.log('hsl set')
    } else {
      evaluatedBg = this.hexToRGB(bg)
      evaluatedFg = this.hexToRGB(fg)
    }

    const colors = {
      bg: evaluatedBg,
      fg: evaluatedFg,
      bgSum: 0,
      fgSum: 0
    }


    const contrastRatio = this.getContrastRatio(colors)

    const report = this.getReport(contrastRatio)

    this.log(JSON.stringify(report, null, '\t'))

  }

  /**
   * 
   * Calculate the contrast ratio
   * 
   * @param {object} colors - the rgb channels for background and foreground
   * 
   * @returns {int} ratio - the contrast ratio
   */
  getContrastRatio(colors) {
    for (const key in colors) {
      if (colors.hasOwnProperty(key) && key === 'bg') {
        const rScaled = this.scaledRgbChannel(colors[key].r) * 0.2126
        const gScaled = this.scaledRgbChannel(colors[key].g) * 0.7152
        const bScaled = this.scaledRgbChannel(colors[key].b) * 0.0722

        colors.bgRatio = rScaled + gScaled + bScaled + 0.05

      } else if (colors.hasOwnProperty(key) && key === 'fg') {
        const rScaled = this.scaledRgbChannel(colors[key].r) * 0.2126
        const gScaled = this.scaledRgbChannel(colors[key].g) * 0.7152
        const bScaled = this.scaledRgbChannel(colors[key].b) * 0.0722

        colors.fgRatio = rScaled + gScaled + bScaled + 0.05

      }
    }

    return colors.bgRatio > colors.fgRatio ?
      colors.bgRatio / colors.fgRatio :
      colors.fgRatio / colors.bgRatio
  }

  /**
   * 
   * @param {int} ratio the contrast ratio. all are assumed to be x:1
   * 
   * @returns {object} a report on the contrast ratio and its WCAG compliance
   */
  getReport(ratio) {

    const AA = ratio > 4.5 ? "pass" : "fail"
    const AALarge = ratio > 3 ? "pass" : "fail"
    const AAA = ratio > 7 ? "pass" : "fail"
    const AAALarge = ratio > 4.5 ? "pass" : "fail"

    return {
      ratio,
      AA,
      AALarge,
      AAA,
      AAALarge
    }
  }

  /**
   * 
   * Remove the # from the beginning of a hexadecimal color if it's present
   * 
   * @param {string} hex a hexadecimal color string
   * 
   * @returns {string} a hexadecimal string without the #
   */
  trimHash(hex) {
    return hex.indexOf('#') >= 0 ? hex.substring(1).trim() : hex.trim();
  }

  /**
   * 
   * Convert a hexadecimal color to rgb values
   * 
   * @param {string} hex a hexadecimal color string
   * 
   * @returns {object} 8bit rgb channel values
   */
  hexToRGB(hex) {
    const h = this.trimHash(hex)

    // if the hex only has three characters, double each.
    // otherwise use them all
    const r = h.length === 3 ? `0x${h[0]}${h[0]}` : `0x${h[0]}${h[1]}`
    const g = h.length === 3 ? `0x${h[1]}${h[1]}` : `0x${h[2]}${h[3]}`
    const b = h.length === 3 ? `0x${h[2]}${h[2]}` : `0x${h[4]}${h[5]}`

    // convert the values to integers
    return {
      r: +r,
      g: +g,
      b: +b
    }

  }

  /**
   * 
   * RGB values passed via the cli must be entered as strings.
   * In order to get the color contrast, the individual channels need to be converted to integers first.
   * 
   * @param {string} rgb an rgb string in the format 'rgb(r, g, b)'
   */
  cleanRGB(rgb) {

    const regex = /(\d+)/g

    // convert the strings returned from the regex match to integers
    const rgbArray = rgb.match(regex).map(x => +x)

    return {
      r: rgbArray[0],
      g: rgbArray[1],
      b: rgbArray[2]
    }
  }

  /**
   * 
   * Scale 8bit RGB values according to relative luminance
   * 
   * see - https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   * 
   * @param {int} c an 8bit rgb value
   */
  scaledRgbChannel(c) {
    const unscaled = c / 255

    let scaled = 0

    if (unscaled <= 0.03928) {
      scaled = unscaled / 12.92
    } else {
      const base = (unscaled + 0.055) / 1.055
      scaled = Math.pow(base, 2.4)
    }

    return scaled
  }

}

ContrastCommand.description = `A utility to check for WCAG compliant color contrast`

ContrastCommand.usage = `[-f <foreground hex value>] [-b <background hex value>]`

ContrastCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' }),
  background: flags.string({ char: 'b', description: 'background color' }),
  foreground: flags.string({ char: 'f', description: 'foreground color' }),
  hsl: flags.boolean({ char: 'l', default: false, description: 'set this flag to pass hsl values' }),
  rgb: flags.boolean({ char: 'r', default: false, description: `set this flag to pass rgb values. they must be passed as a string - 'rgb(r,g,b)'` }),
  hex: flags.boolean({ char: 'x', default: true, description: 'this flag is optional. values passed are assumed to be hexadecimal' }),
}



module.exports = ContrastCommand
