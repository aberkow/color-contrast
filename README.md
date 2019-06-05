# color-contrast
==============
A small utility to calculate color contrast and determine WCAG compliance. This tool is based on the [WebAIM color contrast checker](https://webaim.org/resources/contrastchecker/). It uses calculations based on the [W3C Web Content Accessibility Guidelines](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef).



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/color-contrast.svg)](https://npmjs.org/package/color-contrast)
[![Downloads/week](https://img.shields.io/npm/dw/color-contrast.svg)](https://npmjs.org/package/color-contrast)
[![License](https://img.shields.io/npm/l/color-contrast.svg)](https://github.com/Projects/color-contrast/blob/master/package.json)

<!-- toc -->
## Usage
<!-- usage -->
TODO
## Commands
<!-- commands -->
Commands take the format `color-contrast [-f <foreground hex value>] [-b <background hex value>]`. Foreground and background values can be entered with or without `#` signs. The default values are
- foreground: `#000000`
- background: `#ffffff`

A report is generated for each ratio. For example, entering this command `color-contrast -f #123abc` returns
```
{
	"ratio": 8.909214716654146,
	"AA": "pass",
	"AALarge": "pass",
	"AAA": "pass",
	"AAALarge": "pass"
}
```

## TODO
- Tests
- Other kinds of color formatting (e.g. rgb, hsl) and possibly transparency 

