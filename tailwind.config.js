const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "node_modules/@frostui/tailwindcss/dist/*.js"
    ],
    darkMode: ['class', '[data-mode="dark"]'],
    theme: {

        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },

        fontFamily: {
            'base': ['"Nunito"', 'sans-serif'],
        },

        extend: {
            colors: {
                primary: {
                    ...colors.emerald,
                    "DEFAULT": colors.emerald[500],
                },

                default: {
                    ...colors.gray,
                },

                'secondary': '#747a80',

                'success': '#20b799',

                'info': '#3cbade',

                'warning': '#efb540',

                'danger': '#fa5944',

                'light': '#e9edf3',

                'dark': '#222a3e',
            },
        },
    },

    plugins: [
        require('preline/plugin'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        plugin(
            function ({ addUtilities, theme }) {
                addUtilities({
                    '.fill-1': {
                        fontVariationSettings: "'FILL' 1",
                    },
                })
            }
        ),
        addDynamicIconSelectors(),
    ],
}