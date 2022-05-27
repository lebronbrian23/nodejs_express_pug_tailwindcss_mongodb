module.exports = {
  content: [
      './views/**/*.pug',
      './src/**/*.pug',
      './components/**/*.pug',
  ],
  theme: {
    extend: {
        dropShadow: {
            '3xl': '0.15rem 0.15rem 0.4rem rgba(0, 0, 0, 0.25)',
        }
    },
  },
  plugins: [],
}
