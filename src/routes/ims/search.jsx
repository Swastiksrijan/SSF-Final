import { createFileRoute, redirect } from '@tanstack/react-router';
import { LangProvider } from '../../ims/LangContext';
import ImsSearch from '../../ims/pages/ImsSearch';

const TOKEN_KEY = 'ssf_admin_token';

export const Route = createFileRoute('/ims/search')({
  validateSearch: (s) => ({
    q: (s && s.q) || '',
    module: (s && s.module) || '',
    type: (s && s.type) || '',
    status: (s && s.status) || '',
    dateFrom: (s && s.dateFrom) || '',
    dateTo: (s && s.dateTo) || '',
  }),
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || '';
    if (!token) throw redirect({ to: '/Admin', search: { redirect: location.href }, replace: true });
  },
  component: () => <LangProvider><ImsSearch /></LangProvider>,
});
