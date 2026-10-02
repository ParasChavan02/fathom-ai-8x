"""Codex lifecycle hook for the public 8x prompt/response capture log."""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = ROOT / ".agent-logs"
TOOL = "codex"
PROJECT = ROOT.name


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def safe_piece(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "-", value)[:48] or "unknown-session"


def session_path(event: dict) -> Path:
    started = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d_%H-%M-%S")
    session_id = str(event.get("session_id") or "unknown-session")
    return LOG_DIR / f"{started}_{safe_piece(session_id)}.md"


def existing_session_log(session_id: str) -> Path | None:
    matches = sorted(LOG_DIR.glob(f"*_{safe_piece(session_id)}.md"))
    return matches[-1] if matches else None


def author() -> str:
    return os.environ.get("GITHUB_USER") or os.environ.get("USERNAME") or "unknown"


def write_header(path: Path, event: dict) -> None:
    timestamp = utc_now()
    model = str(event.get("model") or "unknown")
    session_id = str(event.get("session_id") or "unknown-session")
    path.write_text(
        "---\n"
        f"session_id: {session_id}\n"
        f"date: {timestamp[:10]}\n"
        f"author: {author()}\n"
        f"model: {model}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        "total_exchanges: 0\n"
        f"first_prompt_time: {timestamp}\n"
        f"last_prompt_time: {timestamp}\n"
        "---\n\n"
        f"# Session Log - {timestamp[:10]}\n\n"
        f"Session: `{session_id}` | Project: `{PROJECT}` | Author: `{author()}`\n\n"
        "---\n",
        encoding="utf-8",
        newline="\n",
    )


def exchange_number(path: Path) -> int:
    return path.read_text(encoding="utf-8").count("[LOG_ENTRY type=PROMPT") + 1


def update_metadata(path: Path) -> None:
    """Refresh header fields that are knowable from the captured entries."""
    body = path.read_text(encoding="utf-8")
    prompts = body.count("[LOG_ENTRY type=PROMPT")
    prompt_times = re.findall(
        r"\[LOG_ENTRY type=PROMPT[^\]]*\]\ntimestamp: ([^\n]+)", body
    )
    if not prompt_times:
        return
    header_end = body.find("\n---\n", 4)
    if header_end == -1:
        return
    header = body[:header_end]
    header = re.sub(r"(?m)^total_exchanges: .*?$", f"total_exchanges: {prompts}", header)
    header = re.sub(
        r"(?m)^last_prompt_time: .*?$", f"last_prompt_time: {prompt_times[-1]}", header
    )
    path.write_text(header + body[header_end:], encoding="utf-8", newline="\n")


def capture_prompt(event: dict) -> None:
    LOG_DIR.mkdir(exist_ok=True)
    session_id = str(event.get("session_id") or "unknown-session")
    path = existing_session_log(session_id) or session_path(event)
    if not path.exists():
        write_header(path, event)
    number = exchange_number(path)
    timestamp = utc_now()
    model = str(event.get("model") or "unknown")
    prompt = str(event.get("prompt") or "")
    with path.open("a", encoding="utf-8", newline="\n") as log:
        log.write(
            f"\n\n[LOG_ENTRY type=PROMPT num={number} session={session_id}]\n"
            f"timestamp: {timestamp}\nmodel: {model}\n\n{prompt}\n"
        )
    update_metadata(path)


def capture_response(event: dict) -> None:
    LOG_DIR.mkdir(exist_ok=True)
    session_id = str(event.get("session_id") or "unknown-session")
    path = existing_session_log(session_id)
    if path is None:
        return
    body = path.read_text(encoding="utf-8")
    prompts = body.count("[LOG_ENTRY type=PROMPT")
    responses = body.count("[LOG_ENTRY type=RESPONSE")
    if responses >= prompts:
        return
    timestamp = utc_now()
    model = str(event.get("model") or "unknown")
    response = str(event.get("last_assistant_message") or "")
    with path.open("a", encoding="utf-8", newline="\n") as log:
        log.write(
            f"\n\n[LOG_ENTRY type=RESPONSE num={prompts} session={session_id}]\n"
            f"timestamp: {timestamp}\nmodel: {model}\n\n{response}\n"
        )
    update_metadata(path)


def main() -> int:
    if len(sys.argv) != 2 or sys.argv[1] not in {"prompt", "response"}:
        return 2
    try:
        # Codex delivers hook JSON as UTF-8.  Reading the text wrapper on Windows
        # can otherwise decode non-ASCII prompt text with the active code page.
        event = json.loads(sys.stdin.buffer.read().decode("utf-8"))
        if sys.argv[1] == "prompt":
            capture_prompt(event)
        else:
            capture_response(event)
    except Exception as exc:  # Hooks must not interfere with the user turn.
        print(json.dumps({"systemMessage": f"Capture hook error: {exc}"}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
