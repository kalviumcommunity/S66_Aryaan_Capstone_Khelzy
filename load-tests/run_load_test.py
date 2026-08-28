#!/usr/bin/env python3
"""Run the Khelzy k6 load test and save raw JSON metrics."""

import argparse
import os
import shutil
import subprocess
from pathlib import Path


def find_k6():
    """Find k6 on PATH or in common Windows installation locations."""
    executable = shutil.which("k6")
    if executable:
        return executable

    if os.name == "nt":
        candidates = [
            Path(os.environ.get("ProgramFiles", "")) / "k6" / "k6.exe",
            Path(os.environ.get("ProgramFiles", "")) / "GrafanaLabs" / "k6" / "k6.exe",
            Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "k6" / "k6.exe",
        ]
        for candidate in candidates:
            if candidate.is_file():
                return str(candidate)

    return None


def main():
    parser = argparse.ArgumentParser(description="Run the Khelzy k6 load test")
    parser.add_argument(
        "--base-url",
        default="https://khelzy-backend.vercel.app",
        help="Deployed Khelzy backend URL",
    )
    parser.add_argument(
        "--out",
        default="load-tests/results/raw-results.json",
        help="Raw k6 JSON output path",
    )
    args = parser.parse_args()

    k6 = find_k6()
    if k6 is None:
        raise SystemExit(
            "k6 was not found on PATH or in a standard Windows install location. "
            "Restart Git Bash after installing k6, or add its folder to PATH."
        )

    root = Path(__file__).resolve().parent.parent
    script = root / "load-tests" / "khelzy-load-test.js"
    output = root / args.out
    output.parent.mkdir(parents=True, exist_ok=True)

    environment = os.environ.copy()
    environment["BASE_URL"] = args.base_url.rstrip("/")
    command = [k6, "run", f"--out=json={output}", str(script)]

    print(f"Target: {environment['BASE_URL']}/games")
    print("Peak virtual users: 120")
    raise SystemExit(subprocess.run(command, env=environment).returncode)


if __name__ == "__main__":
    main()
