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
