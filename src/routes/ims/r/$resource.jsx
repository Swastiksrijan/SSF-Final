import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../../ims/LangContext';
import ImsResource from '../../../ims/pages/ImsResource';

const TOKEN_KEY = 'ssf_admin_token';

const clean = (v) => { let x = v; if (typeof x === 'string') x = x.replace(/^"|"$/g, ''); return x == null ? '' : String(x); };

export const Route = createFileRoute('/ims/r/$resource')({
  validateSearch: (s) => ({ open: clean(s && s.open) }),
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsResource /></LangProvider>,
});
