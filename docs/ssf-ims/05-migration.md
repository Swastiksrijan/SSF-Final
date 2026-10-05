# SSF-IMS — Legacy data import (migration)

> Aapka niyam: **"kuch hatana nhi"**. Isliye ye migration **sirf jodta hai**,
> kuch badalta ya hatata nahi. Dobara chalane par duplicate nahi banta.

## 1. Ye kya karta hai

Purane **SSF Digital Office** ka data utha kar naye **SSF-IMS masters** me
additive roop se daalta hai:

| Purana source | Naya IMS record |
|---|---|
| `Members` | **Person** + **Membership** (+ role `member`) |
| `Volunteers` | **Person** + **Volunteer** (+ role `volunteer`) |
| `Donors` | **Person** + **Donor** (+ role `donor`) |
| `FinanceTransactions` | **Transaction** |
| `DigitalOfficeRecords` (module map) | meeting / resolution / activity / asset / document / project / voucher / grant / compliance / audit / risk / notice ... |

Person **mobile/email** se match hota hai — same aadmi dobara nahi banta,
balki usi Person ko naya role milta hai. Yahi *"ENTER ONCE → LINK EVERYWHERE"*.

## 2. Additive + idempotent kaise

- Har imported legacy row ka nishaan `ImsRelations` me `fromType='legacy'`,
  `fromId='<module>:<recordId>'` ke roop me save hota hai.
- Agli baar wahi row mile to **skip** ho jaata hai — dubara entry nahi.
- Koi legacy row **update ya delete nahi** hoti. Sirf naye IMS rows bante hain.

## 3. Chalane ke 3 tarike

**A. UI (sabse aasan)** — `/ims/data` page:
- "Preview (dry run)" → kya-kya banega dikhata hai (kuch likhta nahi).
- "Import now" → asli import.

**B. CLI (server par)**:
```bash
cd backend_node
node scripts/migrate-legacy.js          # dry run (default)
node scripts/migrate-legacy.js --apply  # asli import
```

**C. API**:
```
GET  /api/ims/migrate-legacy   # dry run
POST /api/ims/migrate-legacy   # import
```
(Bearer token: wahi `ADMIN_PORTAL_TOKEN`.)

## 4. Pehle kya karein (safe order)

1. **Production DB ka backup** lein (Render se).
2. Pehle **dry run** chalayein — dekh lein kitna banega.
3. Phir **import** chalayein.
4. `Integrity` page par jaayein — duplicate/adhure records check karein.
5. Zarurat ho to `Persons` list me jaakar naye Person dekh lein.

## 5. Testing (sandbox me ki gayi)

- 6 legacy rows banaye → dry run me 7 naye records "wouldCreate" dikhe.
- Import chalaya → sab ban gaye (3 Person + 1 member + 1 volunteer +
  1 donor + 1 txn + 1 meeting + 1 resolution).
- **Dubara chalaya → 6 skipped** (idempotent ✅), koi duplicate nahi.
- `unmapped` khali — yaani har module ka map mil gaya.

*End of migration guide.*
