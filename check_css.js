const fs = require('fs');
const css = fs.readFileSync('.next/static/css/app/layout.css', 'utf8');
const classes = [
  'fixed',
  'inset-0',
  'left-[50%]',
  'top-[50%]',
  'translate-x-[-50%]',
  'translate-y-[-50%]',
  'bg-background',
  'overflow-hidden',
  'max-h',
  'grid',
  'flex'
];
classes.forEach(c => {
  // Check if the CSS contains the escaped class name or normal class name
  const escaped = c.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/%/g, '\\%');
  const regex = new RegExp(`\\.${escaped}[\\s{:]`);
  if (regex.test(css) || css.includes(`.${c}{`) || css.includes(c)) {
    console.log(`${c}: FOUND`);
  } else {
    console.log(`${c}: MISSING`);
  }
});
