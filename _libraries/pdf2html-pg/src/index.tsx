const pdf2html = require('pdf2html');

// convert to html:
(async () => {
  const html = await pdf2html.html('tmp/example.pdf');
  console.log(html);
})();


// convert to string:
// (async () => {
//   const text = await pdf2html.text('tmp/example.pdf');
//   console.log(text);
// })()
