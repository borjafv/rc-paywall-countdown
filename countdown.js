// Rolling countdown reproducing Superwall's `localDateTime | date_add: "Nm" |
// countdown_from: state.now`: the deadline is computed once at load as
// (now + start seconds), so every open restarts it. RC's native Countdown only
// targets a fixed absolute date and can't express this per-session behavior.
//
// Lives in an external file (not inline) because RC's web-bundle CSP is
// `script-src 'self' … https://sdk.revenuecat-static.com` with no 'unsafe-inline'.
//
// Query string (one hosted bundle serves every timer paywall):
//   start      seconds until zero at load          (default 600 = 10:00)
//   capMin     cap the minutes field               (gift timers: 9)
//   prefix     text before the clock               ("Ends in ")
//   color      light-mode color                    (default #000)
//   colorDark  dark-mode color (prefers-color-scheme); falls back to color
//   size       font-size px                        (default 20)
//   weight     font-weight                         (default 700)
//   lineHeight line-height px                        (default 1)
//   family     font-family override
//   letter     letter-spacing px
//   align      start | center | end                (default start)
//   hideAt0    "1" hides the label once ended
(function () {
  const q = new URLSearchParams(location.search);
  const has = (k) => q.get(k) !== null;
  const nnum = (k, d) => { const v = Number(q.get(k)); return has(k) && Number.isFinite(v) ? v : d; };

  const startS = nnum('start', 600);
  const capMin = has('capMin') ? nnum('capMin', Infinity) : Infinity;
  const prefix = q.get('prefix') ?? '';
  const hideAt0 = q.get('hideAt0') === '1';

  const wrap = document.getElementById('wrap');
  const label = document.getElementById('label');

  const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const color = (dark && has('colorDark')) ? q.get('colorDark') : (q.get('color') || '#000');
  label.style.color = color;
  label.style.fontSize = (q.get('size') || '20') + 'px';
  label.style.fontWeight = q.get('weight') || '700';
  if (has('lineHeight')) label.style.lineHeight = q.get('lineHeight') + 'px';
  if (q.get('family')) label.style.fontFamily = q.get('family') + ', -apple-system, system-ui, sans-serif';
  if (has('letter')) label.style.letterSpacing = q.get('letter') + 'px';
  const alignMap = { start: 'flex-start', end: 'flex-end', center: 'center' };
  wrap.style.justifyContent = alignMap[q.get('align')] || 'flex-start';

  const deadline = Date.now() + startS * 1000;
  const pad = (n) => String(n).padStart(2, '0');

  function render() {
    const remMs = deadline - Date.now();
    if (remMs <= 0) { label.textContent = hideAt0 ? '' : prefix + '0:00'; return; }
    const totalSec = Math.ceil(remMs / 1000);
    let min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min > capMin) min = capMin;
    label.textContent = prefix + min + ':' + pad(sec);
  }

  render();
  setInterval(render, 250);
})();
