import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import ImsCorrespondence from '../../ims/pages/ImsCorrespondence';

const TOKEN_KEY = 'ssf_admin_token';
const clean = (v) => { let x = v; if (typeof x === 'string') x = x.replace(/^"|"$/g, ''); return x == null ? '' : String(x); };

export const Route = createFileRoute('/ims/correspondence')({
  validateSearch: (s) => ({ tab: clean(s && s.tab) }),
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsCorrespondence /></LangProvider>,
});
