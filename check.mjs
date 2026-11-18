// Self-check for the countdown formatting logic used in index.html.
const pad = (n) => String(n).padStart(2, '0');
function fmt(remMs, { capMin = Infinity, prefix = '', hideAt0 = false } = {}) {
  if (remMs <= 0) return hideAt0 ? '' : prefix + '0:00';
  const totalSec = Math.ceil(remMs / 1000);
  let min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > capMin) min = capMin;
  return prefix + min + ':' + pad(sec);
}

const cases = [
  [600000, {}, '10:00'],                                   // 10:00 uncapped (txn_abandon)
  [599000, { capMin: 9, prefix: 'Ends in ' }, 'Ends in 9:59'], // gift: capped at 9
  [600000, { capMin: 9, prefix: 'Ends in ' }, 'Ends in 9:00'], // gift: 10:00 -> capped to 9:00
  [65000, {}, '1:05'],                                     // zero-pad seconds
  [1000, {}, '0:01'],
  [0, {}, '0:00'],
  [-5000, { hideAt0: true }, ''],                          // hidden when ended
  [59999, {}, '1:00'],                                     // ceil rounds up
];

let ok = 0;
for (const [ms, opts, want] of cases) {
  const got = fmt(ms, opts);
  const pass = got === want;
  ok += pass;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${ms}ms ${JSON.stringify(opts)} -> "${got}"${pass ? '' : ` (want "${want}")`}`);
}
if (ok !== cases.length) {
  console.error(`\n${cases.length - ok} failing`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} passed`);
