# Khelzy load-test report

> This report is based on the measured output in `latest-summary.json`.

- Test date/time (UTC): `[not recorded in summary]`
- Deployment URL: `https://khelzy-backend.vercel.app`
- k6 version: `[not recorded]`
- Scenario: 50 users / 20s, 100 users / 30s, 120 users / 60s, ramp-down / 20s
- Endpoint: `GET /games`

## Measured results

- Peak virtual users: **120**
- Test duration: **131 seconds**
- Total requests: **6,935**
- Requests per second: **53.06**
- Failed requests: **0** (**0%**)
- Average response time: **528.02 ms**
- Median response time: **441.55 ms**
- p95 response time: **675.33 ms**
- p99 response time: `[not included in generated summary]`
- Maximum response time: **4,181.95 ms**
- Check pass rate: **100%**
- Thresholds passed: **Yes** — all configured thresholds passed
- Observed failures or timeouts: **None recorded**

## Honest resume-ready statement

`Measured 120 virtual users for approximately 2.2 minutes against the deployed Khelzy games endpoint, with 0% failed requests, 100% checks passed, and p95 latency of 675.33 ms.`

This result describes one test run and does not establish continuous 99.9% uptime.
