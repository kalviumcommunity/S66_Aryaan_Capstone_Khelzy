# Khelzy Authentication Performance Report

## Objective

Measure login completion time for Khelzy's email/password flow and Google OAuth flow using Playwright. The purpose is to test the claims of a 40% login-time reduction and a 30% drop-off reduction.

## Methodology

- Tool: Playwright with Chromium.
- Environment: local Khelzy frontend at `http://localhost:5173`.
- Flow start: `/landing`.
- Navigation: click the first `Browse Games` button, which opens `/login`.
- Password flow: fill the email and password fields and click the exact `Sign in` button.
- Completion: successful navigation to `/home`.
- Timing: Node `Date.now()` immediately before opening the flow until `/home` is reached.
- Warm-up trials: 10.
- Measured trials: 30.
- Test account: credentials supplied at runtime through environment variables and not stored in this report.

## Password login results

| Metric | Result |
|---|---:|
| Measured trials | 30 |
| Successful trials | 30 |
| Failed trials | 0 |
| Average | 4,338.07 ms |
| Median | 4,315 ms |
| Minimum | 4,106 ms |
| Maximum | 4,925 ms |
| Standard deviation | 181.56 ms |

Raw per-trial data:

```text
artifacts/auth-performance/password-raw.json
```

Summary data:

```text
artifacts/auth-performance/summary.json
```

## Google OAuth results

Google OAuth was not measured because the required Playwright authenticated session was not available:

```text
playwright/.auth/google-user.json
```

The OAuth setup requires an interactive sign-in with the authorized account `aryaanpanwar@gmail.com`:

```bash
node tests/setup-google-auth.js
```

No Google password is stored or automated. Until the OAuth storage state is created and the test completes, Google OAuth has zero valid timing trials.

| Metric | Google OAuth |
|---|---:|
| Measured trials | 0 |
| Successful trials | 0 |
| Average | Not available |
| Median | Not available |

## Claim assessment

### 40% login-time reduction

The password baseline is **4,338.07 ms average**. A reduction percentage cannot yet be calculated because there is no valid Google OAuth dataset.

```text
percentage reduction =
((password average - OAuth average) / password average) * 100
```

Decision: **not substantiated yet**.

### 30% drop-off reduction

Timing data cannot prove drop-off reduction. This claim requires baseline and comparison funnel data containing login-start and successful-login events.

```text
drop-off = (login starts - successful logins) / login starts
```

Decision: **unsubstantiated** because no baseline funnel data was provided.

## Test scripts

Main benchmark:

```text
tests/authentication-performance.spec.js
```

Google OAuth session setup:

```text
tests/setup-google-auth.js
```

Run the password benchmark:

```bash
KHELZY_BASE_URL=http://localhost:5173 \
KHELZY_TEST_EMAIL=test@gmail.com \
KHELZY_TEST_PASSWORD='<password supplied privately>' \
KHELZY_AUTH_FLOW=password \
KHELZY_WARMUPS=10 \
KHELZY_TRIALS=30 \
npx playwright test tests/authentication-performance.spec.js
```

After creating the OAuth storage state, run:

```bash
KHELZY_BASE_URL=http://localhost:5173 \
KHELZY_AUTH_FLOW=google \
KHELZY_WARMUPS=10 \
KHELZY_TRIALS=30 \
npx playwright test tests/authentication-performance.spec.js
```
