// Shared IMS data helpers: load any register's records, and turn rows into CSV.
import { useEffect, useState } from 'react';
import { ims } from './api';

/** Load every active record of a register (used by workspaces that filter in-page). */
export function useResourceRecords(resource, params = {}) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [nonce, setNonce] = useState(0);
  const key = JSON.stringify(params);
  useEffect(() => {
    let live = true;
    setRows(null);
    (async () => {
      try {
        const r = await ims.list(resource, { limit: 500, ...params });
        if (live) setRows(r.records || []);
      } catch (e) {
        if (live) { setErr(e.message); setRows([]); }
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, key, nonce]);
  return { rows, err, reload: () => setNonce((n) => n + 1) };
}

/** CSV text from an array of row objects (object columns dropped). */
export function rowsToCsv(rows) {
  if (!rows || !rows.length) return '';
  const cols = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object');
  return [cols.join(',')]
    .concat(rows.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')))
    .join('\n');
}
