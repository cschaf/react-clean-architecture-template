module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // files to scan for CSS classes
  css: ['./src/App.css', './src/index.css'], // CSS files to purge
  output: './src/purged.css', // output path for the purged CSS file
  // You can add more options here, like safelisting specific classes
  // safelist: ['random', 'yep', 'button'],
};
