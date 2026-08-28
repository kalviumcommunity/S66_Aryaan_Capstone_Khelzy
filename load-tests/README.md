# Khelzy load-test evidence

This directory contains a k6 test for the deployed Khelzy backend.

## Tool and scenario

- Tool: [k6](https://k6.io/)
- Endpoint: `GET /games`
- Default target: `https://khelzy-backend.vercel.app`
- Duration: 130 seconds
- Peak load: 120 virtual users
- Stages: 20s to 50 users, 30s to 100 users, 60s at 120 users, then 20s ramp-down
- Each virtual user waits one second between requests

The test checks HTTP status, JSON responses, and non-empty response bodies. Its default thresholds are less than 1% failed requests, p95 latency below 2 seconds, and checks above 99%.

## Run

Install k6, then from the repository root run:

```bash
python load-tests/run_load_test.py
```

Or run k6 directly:

```bash
k6 run --out json=load-tests/results/raw-results.json load-tests/khelzy-load-test.js
```

Use another deployment with `--base-url`. The Python launcher writes raw metrics to `load-tests/results/raw-results.json`; k6 also writes the summary to `load-tests/results/latest-summary.json`.

Do not describe the application as supporting 100+ users or 99.9% uptime based on this test alone. Complete the test, preserve its output, and use the measured values in `results/report.md`.
