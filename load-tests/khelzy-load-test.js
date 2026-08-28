import http from "k6/http";
import { check, sleep } from "k6";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.1.0/index.js";

const BASE_URL = (__ENV.BASE_URL || "https://khelzy-backend.vercel.app").replace(/\/$/, "");

export const options = {
  stages: [
    { duration: "20s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "60s", target: 120 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/games`, {
    tags: { endpoint: "games-list" },
  });

  check(response, {
    "status is 2xx": (res) => res.status >= 200 && res.status < 300,
    "response is JSON": (res) => res.headers["Content-Type"]?.includes("application/json"),
    "response body is not empty": (res) => Boolean(res.body && res.body.length > 0),
  });

  sleep(1);
}

function metric(name) {
  return data.metrics[name]?.values || {};
}

let data;

export function handleSummary(summaryData) {
  data = summaryData;
  const requests = metric("http_reqs");
  const duration = metric("http_req_duration");
  const failures = metric("http_req_failed");
  const checks = metric("checks");
  const vus = metric("vus");

  const conciseSummary = {
    target: `${BASE_URL}/games`,
    scenario: {
      peak_virtual_users: vus.max,
      duration_seconds: summaryData.state.testRunDurationMs
        ? Math.round(summaryData.state.testRunDurationMs / 1000)
        : null,
    },
    requests: {
      total: requests.count,
      rate_per_second: requests.rate,
      failed: failures.rate != null && requests.count != null
        ? Math.round(failures.rate * requests.count)
        : null,
      error_rate_percent: failures.rate != null
        ? Number((failures.rate * 100).toFixed(2))
        : null,
    },
    response_time_ms: {
      average: duration.avg,
      median: duration.med,
      p95: duration["p(95)"],
      p99: duration["p(99)"],
      maximum: duration.max,
    },
    checks: {
      pass_rate_percent: checks.rate != null
        ? Number((checks.rate * 100).toFixed(2))
        : null,
    },
    thresholds: summaryData.metrics
      ? Object.fromEntries(
          Object.entries(summaryData.metrics)
            .filter(([, value]) => value.thresholds)
            .map(([name, value]) => [
              name,
              Object.fromEntries(
                Object.entries(value.thresholds).map(([threshold, result]) => [
                  threshold,
                  result.ok,
                ]),
              ),
            ]),
        )
      : {},
  };

  return {
    stdout: textSummary(summaryData, { indent: " ", enableColors: false }),
    "load-tests/results/latest-summary.json": JSON.stringify(conciseSummary, null, 2),
  };
}
