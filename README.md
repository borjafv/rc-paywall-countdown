# RC Paywall Countdown Component

Self-contained rolling countdown used by RevenueCat paywalls migrated from Superwall
for the TLDL (Mode Mobile) project. RC's `web_view` component loads this page over
HTTPS; the deadline is computed at load as `now + start seconds`, reproducing
Superwall's `localDateTime | date_add: "Nm"` rolling timer (every open restarts it),
which RC's native fixed-date Countdown cannot do.

Configure via query string (see `index.html` for the full list): `start`, `capMin`,
`prefix`, `color`, `size`, `weight`, `family`, `align`, `hideAt0`.

`node check.mjs` verifies the formatting logic.
