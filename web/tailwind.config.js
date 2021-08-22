const colors = require("tailwindcss/colors");

module.exports = {
	purge: [ "./src/**/*.tsx", "./public/index.html" ],
	darkMode: "class",
	theme: {
		extend: {
			gray: colors.trueGray,
			colors: {
				contrast: Object.fromEntries(
					// light mode: white -> black
					// dark mode:  black -> white
					[ 0, 50, 100, 200, 300, 400, 500, 600, 800, 900
					].map(n => [n, `var(--cl-contrast-${n})`])
				)
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
