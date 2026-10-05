#!/usr/bin/env python3
"""Scaffold and validate Counterplay plugin bundles using Python's standard library."""

import argparse
import json
import re
import shutil
from pathlib import Path

MANIFEST_LIMIT = 64 * 1024
SOURCE_LIMIT = 1024 * 1024
ID_PATTERN = re.compile(r"[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*\Z")
VERSION_PATTERN = re.compile(r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\Z")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def contained_file(bundle, relative):
    path = (bundle / relative).resolve()
    require(path.is_relative_to(bundle) and path != bundle, "A plugin file resolves outside its bundle.")
    require(path.is_file(), f"Missing plugin file: {relative}")
    return path


def read_bounded(path, limit):
    with path.open("rb") as stream:
        data = stream.read(limit + 1)
    require(len(data) <= limit, f"Plugin file exceeds its size limit: {path.name}")
    return data.decode("utf-8")


def validate(bundle_path):
    require(bundle_path.suffix == ".counterplayplugin", "Choose a .counterplayplugin folder.")
    require(not bundle_path.is_symlink(), "A plugin bundle cannot be a symbolic link.")
    bundle = bundle_path.resolve()
    require(bundle.is_dir(), "A plugin bundle must be a folder.")
    manifest = json.loads(read_bounded(contained_file(bundle, "manifest.json"), MANIFEST_LIMIT))
    require(isinstance(manifest, dict), "The manifest must be a JSON object.")
    identifier = manifest.get("id")
    require(isinstance(identifier, str) and len(identifier) <= 128 and ID_PATTERN.fullmatch(identifier), "Invalid plugin ID.")
    name = manifest.get("name")
    require(isinstance(name, str) and bool(name.strip()) and len(name) <= 120, "Invalid plugin name.")
    version = manifest.get("version")
    require(isinstance(version, str) and len(version) <= 64 and VERSION_PATTERN.fullmatch(version), "Versions must use numeric major.minor.patch format.")
    require(type(manifest.get("apiVersion")) is int and manifest["apiVersion"] == 1, "Unsupported API version.")
    description = manifest.get("description")
    require(description is None or isinstance(description, str) and len(description) <= 2048, "Invalid plugin description.")
    permissions = manifest.get("permissions")
    require(isinstance(permissions, list) and all(isinstance(item, str) for item in permissions), "Permissions must be a list of strings.")
    require(len(set(permissions)) == len(permissions) and "document.read" in permissions and set(permissions) <= {"document.read", "document.write", "ui.preview", "ui.windows", "storage", "font.compile"}, "Plugins must request document.read and use supported permissions.")
    windows = manifest.get("windows") or []
    require(isinstance(windows, list) and len(windows) <= 16, "Declare up to 16 windows.")
    require(not windows or "ui.windows" in permissions, "Windows require ui.windows.")
    window_ids, entries = set(), set()
    for window in windows:
        require(isinstance(window, dict), "Each window must be an object.")
        window_id = window.get("id")
        require(isinstance(window_id, str) and len(window_id) <= 128 and ID_PATTERN.fullmatch(window_id) and window_id not in window_ids, "Invalid or duplicate window ID.")
        window_ids.add(window_id)
        require(isinstance(window.get("title"), str) and bool(window["title"].strip()) and len(window["title"]) <= 120, "Invalid window title.")
        for field, default, low, high in [("width", 1000, 320, 1920), ("height", 720, 240, 1400)]:
            value = window.get(field, default)
            require(type(value) is int and low <= value <= high, f"Invalid window {field}.")
        require(window.get("style", "window") in ("window", "panel"), "Window style must be window or panel.")
        entry = window.get("entry")
        require(isinstance(entry, str) and entry.endswith(".html"), "Windows need an HTML entry.")
        entries.add(entry)
    resources = manifest.get("resources") or []
    require(isinstance(resources, list) and all(isinstance(item, str) for item in resources) and len(resources) <= 256 and len(resources) == len(set(resources)), "Declare up to 256 unique resources.")
    total = 0
    for relative in sorted(entries | set(resources)):
        require(not relative.startswith("_counterplay/"), "The _counterplay resource namespace belongs to the host UI kit.")
        require(len(relative) <= 512 and re.fullmatch(r"[A-Za-z0-9_./-]+", relative) and all(part not in {"", ".", ".."} for part in relative.split("/")) and Path(relative).suffix in {".html", ".css", ".js", ".json", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".woff", ".woff2", ".txt"}, "Invalid resource path.")
        with contained_file(bundle, relative).open("rb") as stream:
            data = stream.read(2 * 1024 * 1024 + 1)
        require(len(data) <= 2 * 1024 * 1024, "Each resource is limited to 2 MB.")
        total += len(data)
    require(total <= 16 * 1024 * 1024, "Plugin resources exceed 16 MB.")
    commands = manifest.get("commands")
    require(isinstance(commands, list) and 1 <= len(commands) <= 64, "A plugin needs 1–64 commands.")
    seen = set()
    for command in commands:
        require(isinstance(command, dict), "Each command must be an object.")
        command_id = command.get("id")
        require(isinstance(command_id, str) and len(command_id) <= 128 and ID_PATTERN.fullmatch(command_id) and command_id not in seen, "Command IDs must be valid and unique.")
        seen.add(command_id)
        title = command.get("title")
        require(isinstance(title, str) and bool(title.strip()) and len(title) <= 120, "Invalid command title.")
        script = command.get("script")
        window_id = command.get("window")
        require((script is not None) != (window_id is not None), "Each command needs exactly one script or window.")
        if window_id is not None:
            require(isinstance(window_id, str) and window_id in window_ids, "Command refers to an undeclared window.")
        else:
            require(isinstance(script, str) and 0 < len(script) <= 512 and script.endswith(".js") and "\\" not in script and "\0" not in script and all(part not in {"", ".", ".."} for part in script.split("/")), "Command scripts must be contained relative .js paths.")
            read_bounded(contained_file(bundle, script), SOURCE_LIMIT)
    return manifest


