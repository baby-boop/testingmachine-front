module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#78BCCA',
        customDisable: '#232B33',
        customYellow: '#B8A680',
      },
    },

  },
  resolve: {
    fallback: {
      fs: require.resolve('browserify-fs'),
    },
  },
  plugins: [],
}