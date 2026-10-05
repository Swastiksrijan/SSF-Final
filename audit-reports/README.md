# SSF Audit Reports Archive

Source: CA (Chartered Accountant) audit reports for Swastik Srijan Foundation Samiti.

## Files received

| FY (year ended 31 March) | Original file name(s) as provided | Archived as | MD5 |
|--------------------------|-----------------------------------|-------------|-----|
| 2021-22 | `SSF Audit 2022 Scan 02-Oct-2022_compressed.pdf` | [`fy-2021-22/SSF-Audit-Report_FY-2021-2022.pdf`](fy-2021-22/SSF-Audit-Report_FY-2021-2022.pdf) | `2014c28034f30bb4e58a482426116d8e` |
| 2022-23 | `SSF Audit 2023 Scan 02-Oct-2025_compressed.pdf` | [`fy-2022-23/SSF-Audit-Report_FY-2022-2023.pdf`](fy-2022-23/SSF-Audit-Report_FY-2022-2023.pdf) | `a09d62d3712277499204027c8654b41c` |
| 2023-24 | `SSF Audit 2024 Scan 02-Oct-2025_compressed.pdf` | [`fy-2023-24/SSF-Audit-Report_FY-2023-2024.pdf`](fy-2023-24/SSF-Audit-Report_FY-2023-2024.pdf) | `8cf79f35e45fd039ee9b8e9b7179050e` |
| 2024-25 | `SSF Audit 2025 Scan 02-Oct-2025_compressed.pdf` | [`fy-2024-25/SSF-Audit-Report_FY-2024-2025.pdf`](fy-2024-25/SSF-Audit-Report_FY-2024-2025.pdf) | `83f9d0d44af564dc40f1cc1f6c06af70` |
| 2025-26 | `SSF Audit Report_FY 2025-2026.pdf.pdf` (alias: `SSF Audit Report_FY 25-26.pdf.pdf`) | [`fy-2025-26/SSF-Audit-Report_FY-2025-2026.pdf`](fy-2025-26/SSF-Audit-Report_FY-2025-2026.pdf) | `2407b88fa5fa0d287df62acd5ac3ba31` |

Notes:
- Filenames label reports by scan year; the FY was confirmed from each report's own header ("for the year ended 31-03-YYYY").
- The two 2025-26 uploads were byte-identical (same MD5), so only one copy is stored.

## Coverage: FY 2021-22 → 2025-26 (all five years) ✓
- FY 2024-25 arrived last (file `SSF Audit 2025 Scan ...`, year ended 31-03-2025).

## Status
- FY 2025-26 set received; processed into the canonical audit dataset on 2026-10-04.
- Earlier years (inception 2013-14 onwards) still to be provided.

## Extracted summary (figures now in `backend_node/data/auditReports.json`)

| FY | Auditor | Income | Expenditure | Result | Closing cash+bank | Closing General Fund |
|----|---------|-------:|------------:|--------|------------------:|---------------------:|
| 2021-22 | S R S N & Associates | 79,370.00 | 9,078.67 | surplus 70,291.33 | 56,726.33 | 1,27,858.33 |
| 2022-23 | S R S N & Associates | 52,976.67 | 49,054.80 | surplus 3,921.87 | 29,922.20 | 1,31,780.20 |
| 2023-24 | S R S N & Associates | 64,171.57 | 41,890.68 | surplus 22,280.89 | 30,853.09 | 1,54,061.09 |
| 2024-25 | Kapil Tiwari & Associates | 77,364.00 | 87,135.25 | deficit 9,771.25 | 21,081.84 | 1,44,289.84 |
| 2025-26 | Kapil Tiwari & Associates | 76,615.00 | 79,396.33 | deficit 2,781.33 | 18,300.51 | 1,41,508.51 |

Each year reconciles: General Fund roll-forward = opening ± result = closing, and each year's opening cash/bank equals the prior year's closing.

## Earlier years
The Samiti was formed in **2013** (inception FY 2013-14). FY **2013-14 to 2020-21** reports are still pending and are recorded as a placeholder (`pendingYears` in `auditReports.json`).

