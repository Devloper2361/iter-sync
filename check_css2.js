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
  const escaped1 = `.${c.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/%/g, '\\%')}{`;
  const escaped2 = `.${c.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/%/g, '\\%')} {`;
  
  if (css.includes(escaped1) || css.includes(escaped2) || css.includes(`.${c}`) || css.includes(`.${c}:`)) {
    console.log(`${c}: FOUND`);
  } else {
    // Check more broadly
    const justName = c.replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]').replace(/%/g, '\\\\%');
    console.log(`${c}: ${css.includes(c) ? 'FOUND (in content)' : 'MISSING completely'}`);
  }
});
