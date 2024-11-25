/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-inter), Inter Tight, Inter, system-ui, Helvetica, Arial, sans-serif',
        mono: 'var(--font-mono), IBM Plex Mono, monospace',
        serif:
          'var(--font-italic), Libre Baskerville, Georgia, Times New Roman, serif',
      },
    },
  },
  plugins: [],
};
