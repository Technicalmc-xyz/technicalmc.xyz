const colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	purge: [ "./src/**/*.{tsx,ts}", "./public/index.html" ],
	darkMode: "class",
	theme: {
		extend: {
			gray: colors.trueGray,
			colors: {
				contrast: Object.fromEntries(
					// light mode: white -> black
					// dark mode:  black -> white
					[ 300, 400, 500, 600, 700, 800, 900
					].map(n => [n, `rgb(var(--cl-contrast-${n}))`])
				)
			},
			boxShadow: {
				// there is no way to change the color of the shadow using taiwind:
				// https://github.com/tailwindlabs/tailwindcss/issues/654
				"sidebar-custom":
					"0 1px 3px 0 rgba(var(--cl-contrast-800), 0.1), 0 1px 2px 0 rgba(var(--cl-contrast-800), 0.06)"
			}
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
