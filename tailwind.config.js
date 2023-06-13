import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Caveat Variable', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#da7c0f',
          50: '#fff2de',
          100: '#fddcb2',
          200: '#fac585',
          300: '#f6ad55',
          400: '#f39627',
          500: '#da7c0f',
          600: '#aa6109',
          700: '#794504',
          800: '#4a2800',
          900: '#1d0d00',
        },
      },
    },
  },
  plugins: [typography],
}
