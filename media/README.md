# SSF Media Vault — photos / files ka ek hi ghar

Yahan SSF ki **raw original files** (photos, documents, graphics) rakhi jaati hain.
Yeh folder **website ke saath publish NAHI hota** (`.gitignore` me hai), aur repo
public hai — isliye yahan rakhna website ko kabhi kharab nahi karta aur public
bhi nahi hota.

## Structure

| Folder | Kya |
|---|---|
| `00-INBOX/` | nayi files pehle yahan |
| `01-team/` | members / volunteers / founder photos |
| `02-programs/` | activities / events / year-wise photos, certificates |
| `03-documents/` | reports, financials, legal PDFs |
| `04-graphics/` | logo, banner, design |
| `05-videos/` | video / audio |
| `06-other/` | baaki (identity docs etc.) |
| `_duplicates/` | dedup se hatayi gayi copies (safe, recoverable) |

## Tools

- `scripts/media-fetch.py "<folder name>"` — Drive folder ko vault me laata hai
  (curl se, per-file retry ke saath). Naam `media-fetch` map se destination leta hai.
- `scripts/media-dedup.py` — exact (SHA-256) + near (dHash) duplicates ko
  `media/_duplicates/` me move karta hai. **Kabhi delete nahi karta.**
- `scripts/media-inventory.py` — gdown log se folder/file list banata hai.

## Rules

1. Original yahin rakho, edit/delete mat karo — website ke liye alag optimized copy banti hai.
2. Duplicate mat daalo — `media-dedup.py` chalа lo.
3. File name saaf: chhote letters + underscore (Ramesh Pandey -> `ramesh_pandey.jpg`).
4. Sensitive (Aadhaar/PAN/ID/bank) kabhi `public/` me na jaaye.