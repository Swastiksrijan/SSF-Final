import re
from collections import defaultdict, Counter

log = open('/tmp/gdown.log', encoding='utf-8', errors='ignore').read().splitlines()

folder_re = re.compile(r'^Retrieving folder \S+ (.+)$')
file_re = re.compile(r'^Processing file \S+ (.+)$')

current = '(root)'
trees = defaultdict(list)
order = []
for line in log:
    m = folder_re.match(line)
    if m:
        name = m.group(1).strip()
        if name == 'contents':
            continue
        current = name
        if name not in order:
            order.append(name)
        continue
    m = file_re.match(line)
    if m:
        trees[current].append(m.group(1).strip())

EXT = {'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico',
       'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt',
       'zip', 'rar', '7z', 'mp4', 'mov', 'avi', 'mp3', 'json', 'exe', 'ai', 'psd'}

total = 0
ext_counter = Counter()
for f, files in trees.items():
    for fname in files:
        e = fname.rsplit('.', 1)[-1].lower() if '.' in fname else '?'
        if e in EXT:
            ext_counter[e] += 1
            total += 1

print(f"FOLDERS: {len(order)}   FILES: {total}")
print("\n=== TYPE BREAKDOWN ===")
for e, n in ext_counter.most_common():
    print(f"  {e:6} {n}")

print("\n=== FOLDER -> file count (by extension) ===")
for f in order:
    files = trees[f]
    c = Counter(x.rsplit('.', 1)[-1].lower() if '.' in x else '?' for x in files)
    summary = ' '.join(f"{k}:{v}" for k, v in c.most_common())
    print(f"  {f:38} total={len(files):4}  {summary}")
