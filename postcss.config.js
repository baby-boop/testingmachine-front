module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  resolve: {
    fallback: {
      "https": require.resolve("https-browserify")
    }
  },
}
