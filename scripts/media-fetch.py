#!/usr/bin/env python3
"""Fetch selected SSF Drive folders into the media vault.

Uses the file IDs already enumerated in a gdown log (so we don't re-list the
folder, which is what triggers Google's rate limit) and downloads each file
individually with retries. Everything lands under media/ which is gitignored.
"""
import os
import re
import subprocess
import sys
import time

LOG = '/tmp/gdown.log'

# folder name -> destination under media/
DEST = {
    'Activity Reports & Photos': 'media/02-programs/activity-reports',
    'Photo 2013-2025-26': 'media/02-programs/photo-2013-2026',
    'Annual Progress Reports': 'media/03-documents/annual-progress-reports',
    'Audited Financial Statements': 'media/03-documents/audited-financial-statements',
    'Bank Statements': 'media/03-documents/bank-statements',
    'Bills & Vouchers': 'media/03-documents/bills-vouchers',
    'Financial Records': 'media/03-documents/financial-records',
    'Legal Documents': 'media/03-documents/legal-documents',
    'SSF All Photo': 'media/02-programs/ssf-all-photo',
    'Certificate photo': 'media/02-programs/certificates',
    'Credential pledge Official': 'media/04-graphics/credential-pledge',
    'SSF Activities Photo': 'media/02-programs/ssf-activities-photo',
    'SSF Logo 2026': 'media/04-graphics/ssf-logo-2026',
    'SSF Team Photo': 'media/01-team/ssf-team-photo',
    'SSF Mix Records': 'media/06-other/ssf-mix-records',
    'Team identity Document': 'media/06-other/team-identity-document',
    'Watermarked Documents': 'media/03-documents/watermarked-documents',
}

folder_re = re.compile(r'^Retrieving folder (\S+) (.+)$')
file_re = re.compile(r'^Processing file (\S+) (.+)$')


def parse_log():
    tree, order, cur = {}, [], None
    for line in open(LOG, encoding='utf-8', errors='ignore'):
        line = line.strip()
        m = folder_re.match(line)
        if m:
            name = m.group(2).strip()
            if name == 'contents':
                continue
            cur = name
            tree.setdefault(name, [])
            order.append(name)
            continue
        m = file_re.match(line)
        if m and cur:
            tree[cur].append((m.group(1), m.group(2).strip()))
    return tree, order


def safe_name(name):
    name = name.replace('/', '_').replace('\\', '_')
    return name.strip() or 'file'


UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'


def download(fid, out):
    """Download one Drive file via curl into `out`. Returns True on success."""
    tmp = out + '.part'
    for base in ('https://drive.usercontent.google.com/download',
                 'https://drive.google.com/uc?export=download'):
        url = f'{base}?id={fid}&export=download&confirm=t'
        try:
            subprocess.run(
                ['curl', '-sL', '--fail', '-A', UA, url, '-o', tmp],
                check=True, timeout=300)
        except subprocess.CalledProcessError:
            continue
        if os.path.exists(tmp) and os.path.getsize(tmp) > 0:
            # Google sometimes returns an HTML error page instead of the file
            with open(tmp, 'rb') as fh:
                head = fh.read(512)
            if b'<html' in head.lower()[:200]:
                os.remove(tmp)
                continue
            os.replace(tmp, out)
            return True
    if os.path.exists(tmp):
        os.remove(tmp)
    return False


def fetch(folder, tree, retries=4, delay=2.0):
    dest = DEST.get(folder)
    if not dest:
        print(f'  !! no destination mapped for "{folder}"')
        return 0, 0
    os.makedirs(dest, exist_ok=True)
    files = tree.get(folder, [])
    ok = fail = 0
    for i, (fid, name) in enumerate(files, 1):
        out = os.path.join(dest, safe_name(name))
        if os.path.exists(out) and os.path.getsize(out) > 0:
            ok += 1
            continue
        for attempt in range(1, retries + 1):
            if download(fid, out):
                ok += 1
                break
            time.sleep(delay * attempt)
        else:
            fail += 1
            print(f'  FAIL {name} ({fid})')
        if i % 25 == 0:
            print(f'  ... {i}/{len(files)} (ok={ok} fail={fail})', flush=True)
    return ok, fail


def main():
    tree, order = parse_log()
    targets = sys.argv[1:] or [f for f in order if f in DEST]
    for folder in targets:
        n = len(tree.get(folder, []))
        print(f'== {folder}  ({n} files) -> {DEST.get(folder)}')
        ok, fail = fetch(folder, tree)
        print(f'   done: ok={ok} fail={fail}')


if __name__ == '__main__':
    main()
