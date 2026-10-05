#!/usr/bin/env python3
"""Validate source-only plugins without executing them; build deterministic packages."""
import argparse
import base64
import hashlib
import json
import re
import subprocess
from pathlib import Path
from bundle import validate, require

MAX = 16 * 1024 * 1024
LEGAL = {'README.md', 'LICENSE'}
TEXT = {'.html', '.js', '.css', '.json', '.svg', '.txt', '.md'}
# Defense in depth, not a proof of absence of malware. Maintainer review is mandatory.
BLOCKED = {
    'dynamic code execution': r'\b(?:eval|Function)\s*\(',
    'network or process access': r'\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|importScripts|require)\s*\(|\bimport\s*\(|\b(?:child_process|Deno|Bun)\b',
    'remote executable content': r'(?:src|href)\s*=\s*[\"\']\s*(?:https?:)?//|@import\s|url\(\s*[\"\']?https?:|\bimport\s.+\bfrom\s*[\"\']',
    'encoded executable payload': r'\batob\s*\(|String\s*\.\s*fromCharCode\s*\(|data\s*:\s*(?:text/html|application/javascript)',
    'private key or credential': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{50,}|\bAKIA[A-Z0-9]{16}',
}

def stable(value):
    return (json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False) + '\n').encode()


def check_tree(root):
    require(root.is_dir() and not root.is_symlink(), 'Missing or linked plugins directory.')
    size = 0
    for path in root.rglob('*'):
        require(not path.is_symlink(), f'Symbolic links are forbidden: {path}')
        require(path.is_dir() or path.is_file(), f'Non-regular file: {path}')
        if path.is_file():
            require(not path.stat().st_mode & 0o111, f'Executable files are forbidden: {path}')
            require(path.stat().st_size <= 2 * 1024 * 1024, f'Oversized file: {path}')
            size += path.stat().st_size
            require(size <= 128 * 1024 * 1024, 'Repository plugin payload exceeds 128 MB.')


def collect(root, base=None):
    check_tree(root / 'plugins')
    entries, packages, ids = [], {}, set()
    for folder in sorted((root / 'plugins').iterdir()):
        require(folder.is_dir() and re.fullmatch(r'[a-z][a-z0-9-]*\.counterplayplugin', folder.name), f'Invalid plugin folder: {folder.name}')
        manifest = validate(folder)
        require(manifest['id'] not in ids, 'Duplicate plugin ID.')
        ids.add(manifest['id'])
        metadata = json.loads((folder / 'community.json').read_text())
        require(set(metadata) == {'author', 'minimumAppVersion'}, 'community.json needs author and minimumAppVersion only.')
        require(isinstance(metadata['author'], str) and 0 < len(metadata['author']) <= 120, 'Invalid author.')
        require(re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+', metadata['minimumAppVersion']) and len(metadata['minimumAppVersion']) <= 32, 'Invalid minimumAppVersion.')
        paths = set(manifest.get('resources', [])) | {w['entry'] for w in manifest.get('windows', [])} | {c['script'] for c in manifest['commands'] if 'script' in c} | LEGAL
        require({p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file()} == paths | {'manifest.json', 'community.json'}, 'Only declared assets, manifest, community metadata, README and LICENSE are allowed.')
        files, lower = {}, set()
        for relative in sorted(paths):
            require(relative in LEGAL or (re.fullmatch(r'[A-Za-z0-9_./-]+', relative) and all(x not in ('', '.', '..') for x in relative.split('/'))), 'Unsafe path.')
            require(relative.lower() not in lower and relative.lower() != 'manifest.json', 'Case-insensitive path collision.')
            lower.add(relative.lower())
            data = (folder / relative).read_bytes()
            require(len(data) <= 2 * 1024 * 1024, 'File exceeds 2 MB.')
            files[relative] = base64.b64encode(data).decode()
            if Path(relative).suffix in TEXT or relative in LEGAL:
                source = data.decode('utf-8')
                require('\x00' not in source, 'NUL bytes in source.')
                for reason, pattern in BLOCKED.items():
                    require(not re.search(pattern, source, re.I), f'{folder.name}/{relative}: blocked {reason}.')
                if relative.endswith('.js'):
                    subprocess.run(['node', '--check', str(folder / relative)], check=True, timeout=20, stdout=subprocess.DEVNULL)
            else:
                signatures = {'.png': b'\x89PNG\r\n\x1a\n', '.jpg': b'\xff\xd8\xff', '.jpeg': b'\xff\xd8\xff', '.webp': b'RIFF', '.woff': b'wOFF', '.woff2': b'wOF2'}
                require(Path(relative).suffix in signatures and data.startswith(signatures[Path(relative).suffix]), 'Unexpected binary asset or executable.')
        require(sum(len(base64.b64decode(v)) for v in files.values()) <= MAX, 'Plugin exceeds 16 MB.')
        package = stable({'manifest': manifest, 'files': files})
        require(len(package) <= 24 * 1024 * 1024, 'Package exceeds 24 MB.')
        digest = hashlib.sha256(package).hexdigest()
        if base and (base / 'plugins' / folder.name).exists():
            old = base / 'plugins' / folder.name
            old_manifest = validate(old)
            require(old_manifest['id'] == manifest['id'], 'Existing plugin IDs cannot change.')
            changed = any(not (old / p).is_file() or (old / p).read_bytes() != (folder / p).read_bytes() for p in paths | {'manifest.json', 'community.json'})
            if changed:
                require(tuple(map(int, manifest['version'].split('.'))) > tuple(map(int, old_manifest['version'].split('.'))), 'Changed plugins must increase their version.')
        entries.append({'manifest': manifest, **metadata, 'folder': folder.name, 'sha256': digest, 'packageBytes': len(package)})
        packages[digest] = package
    require(len(entries) <= 2000, 'Too many plugins.')
    return entries, packages


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('--base', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--commit', default='0' * 40)
    args = parser.parse_args()
    entries, packages = collect(args.root.resolve(), args.base.resolve() if args.base else None)
    require(re.fullmatch('[0-9a-f]{40}', args.commit), 'Invalid source commit.')
    if args.output:
        out = args.output
        (out / 'packages').mkdir(parents=True, exist_ok=True)
        for digest, data in packages.items():
            (out / 'packages' / (digest + '.json')).write_bytes(data)
        catalog = stable({'schemaVersion': 1, 'sourceCommit': args.commit, 'plugins': entries})
        require(len(catalog) <= 4 * 1024 * 1024, 'Catalog exceeds 4 MB.')
        (out / 'catalog.json').write_bytes(catalog)
    print(f'Validated {len(entries)} plugin(s); source, permissions, sizes and JavaScript syntax passed.')

if __name__ == '__main__':
    main()
